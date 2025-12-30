<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Product $product,
        public int $lowStockThreshold = 10
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $admins = User::role('SUPER_ADMIN')->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(
                new LowStockNotification($this->product, $this->lowStockThreshold)
            );
        }
    }
}
