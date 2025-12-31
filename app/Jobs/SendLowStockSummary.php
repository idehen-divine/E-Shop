<?php

namespace App\Jobs;

use App\Mail\LowStockSummary as LowStockSummaryMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendLowStockSummary implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Collection $products,
        public int $threshold
    ) {}

    public function handle(): void
    {
        $admins = User::role('SUPER_ADMIN')->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new LowStockSummaryMail($this->products, $this->threshold));
        }
    }
}
