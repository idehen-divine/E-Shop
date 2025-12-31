<?php

namespace App\Console\Commands;

use App\Jobs\SendDailySalesReportJob;
use App\Models\CartItem;
use Illuminate\Console\Command;

class SendDailySalesReport extends Command
{
    protected $signature = 'sales:send-daily-report';

    protected $description = 'Send daily sales report to admin users';

    public function handle(): int
    {
        $today = now()->startOfDay();
        $endOfDay = now()->endOfDay();

        $salesData = CartItem::whereBetween('created_at', [$today, $endOfDay])
            ->with(['product', 'cart.user'])
            ->get();

        $reportData = [
            'date' => $today->format('F j, Y'),
            'sales' => $salesData,
            'totalRevenue' => $salesData->sum(fn ($item) => $item->quantity * $item->price),
            'totalItems' => $salesData->sum('quantity'),
            'uniqueProducts' => $salesData->unique('product_id')->count(),
        ];

        SendDailySalesReportJob::dispatch($reportData);

        if ($salesData->isEmpty()) {
            $this->info('Daily sales report job dispatched (no sales recorded today).');
        } else {
            $this->info("Daily sales report job dispatched ({$salesData->count()} sale(s)).");
        }

        return self::SUCCESS;
    }
}
