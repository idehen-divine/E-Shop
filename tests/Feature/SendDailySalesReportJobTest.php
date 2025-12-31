<?php

namespace Tests\Feature;

use App\Jobs\SendDailySalesReportJob;
use App\Mail\DailySalesReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SendDailySalesReportJobTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SUPER_ADMIN');
    }

    public function test_job_sends_email_to_all_super_admins(): void
    {
        Mail::fake();

        $admin2 = User::factory()->create();
        $admin2->assignRole('SUPER_ADMIN');

        $regularUser = User::factory()->create();
        $regularUser->assignRole('USER');

        $reportData = [
            'date' => now()->format('F j, Y'),
            'totalRevenue' => 100000,
            'totalItems' => 10,
            'uniqueProducts' => 3,
            'sales' => collect([]),
        ];

        $job = new SendDailySalesReportJob($reportData);
        $job->handle();

        Mail::assertSent(DailySalesReport::class, 2);

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            return $mail->hasTo($this->admin->email);
        });

        Mail::assertSent(DailySalesReport::class, function ($mail) use ($admin2) {
            return $mail->hasTo($admin2->email);
        });

        Mail::assertNotSent(DailySalesReport::class, function ($mail) use ($regularUser) {
            return $mail->hasTo($regularUser->email);
        });
    }

    public function test_job_sends_correct_report_data(): void
    {
        Mail::fake();

        $reportData = [
            'date' => now()->format('F j, Y'),
            'totalRevenue' => 250000,
            'totalItems' => 15,
            'uniqueProducts' => 5,
            'sales' => collect([]),
        ];

        $job = new SendDailySalesReportJob($reportData);
        $job->handle();

        Mail::assertSent(DailySalesReport::class, function ($mail) use ($reportData) {
            return $mail->reportData === $reportData;
        });
    }

    public function test_job_handles_empty_sales_data(): void
    {
        Mail::fake();

        $reportData = [
            'date' => now()->format('F j, Y'),
            'totalRevenue' => 0,
            'totalItems' => 0,
            'uniqueProducts' => 0,
            'sales' => collect([]),
        ];

        $job = new SendDailySalesReportJob($reportData);
        $job->handle();

        Mail::assertSent(DailySalesReport::class);
    }
}
