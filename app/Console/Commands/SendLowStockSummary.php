<?php

namespace App\Console\Commands;

use App\Jobs\SendLowStockSummary as SendLowStockSummaryJob;
use App\Models\Product;
use Illuminate\Console\Command;

class SendLowStockSummary extends Command
{
    protected $signature = 'products:low-stock-summary';

    protected $description = 'Send a summary email of all low stock products to admins';

    public function handle(): int
    {
        $threshold = config('app.low_stock_threshold', 10);

        $lowStockProducts = Product::where('stock', '<=', $threshold)
            ->where('stock', '>', 0)
            ->with('categories')
            ->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info('No low stock products found.');

            return self::SUCCESS;
        }

        SendLowStockSummaryJob::dispatch($lowStockProducts, $threshold);

        $this->info("Low stock summary job dispatched for {$lowStockProducts->count()} product(s).");

        $this->table(
            ['Product', 'SKU', 'Current Stock', 'Price'],
            $lowStockProducts->map(fn ($product) => [
                $product->name,
                $product->sku,
                $product->stock,
                number_format($product->price / 100, 2),
            ])
        );

        return self::SUCCESS;
    }
}
