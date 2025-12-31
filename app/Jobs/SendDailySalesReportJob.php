<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReportJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public array $reportData
    ) {}

    public function handle(): void
    {
        $admins = User::role('SUPER_ADMIN')->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new DailySalesReport($this->reportData));
        }
    }
}
