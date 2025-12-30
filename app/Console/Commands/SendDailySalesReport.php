<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReport;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

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

        if ($salesData->isEmpty()) {
            $this->info('No sales recorded today.');

            return self::SUCCESS;
        }

        $reportData = [
            'date' => $today->format('F j, Y'),
            'sales' => $salesData,
            'totalRevenue' => $salesData->sum(fn ($item) => $item->quantity * $item->price),
            'totalItems' => $salesData->sum('quantity'),
            'uniqueProducts' => $salesData->unique('product_id')->count(),
        ];

        $admins = User::role('SUPER_ADMIN')->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new DailySalesReport($reportData));
        }

        $this->info("Daily sales report sent to {$admins->count()} admin(s).");

        return self::SUCCESS;
    }
}
