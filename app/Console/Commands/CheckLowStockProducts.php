<?php

namespace App\Console\Commands;

use App\Jobs\SendLowStockNotification;
use App\Models\Product;
use Illuminate\Console\Command;

class CheckLowStockProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:check-low-stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for products with low stock and send notifications to admins';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $lowStockThreshold = config('app.low_stock_threshold', 10);

        $lowStockProducts = Product::where('stock', '<=', $lowStockThreshold)
            ->where('stock', '>', 0)
            ->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info('No low stock products found.');

            return self::SUCCESS;
        }

        $count = 0;
        foreach ($lowStockProducts as $product) {
            SendLowStockNotification::dispatch($product, $lowStockThreshold);
            $count++;
        }

        $this->info("Dispatched {$count} low stock notification(s).");

        return self::SUCCESS;
    }
}
