<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SetupEshop extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'eshop:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up the e-shop environment for testing';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Setting up E-shop environment...');
        $this->newLine();

        $this->runMigrations();
        $this->seedDatabase();
        $this->createStorageLink();
        $this->clearApplicationCache();
        $this->runTests();
        $this->optimizeApplication();

        $this->newLine();
        $this->info('✅ E-shop setup completed successfully!');
        $this->displayAdminDetails();

        return self::SUCCESS;
    }

    protected function runMigrations(): void
    {
        $this->info('📦 Running migrations...');

        if (\Schema::hasTable('migrations')) {
            $this->call('migrate:fresh', ['--force' => true]);
        } else {
            $this->call('migrate', ['--force' => true]);
        }

        $this->line('✓ Migrations completed');
    }

    protected function seedDatabase(): void
    {
        $this->info('🌱 Seeding database...');

        $this->call('db:seed', ['--force' => true]);

        $this->line('✓ Database seeded');
    }

    protected function createStorageLink(): void
    {
        $this->info('🔗 Creating storage link...');

        if (file_exists(public_path('storage'))) {
            $this->line('⚠ Storage link already exists');

            return;
        }

        $this->call('storage:link');

        $this->line('✓ Storage link created');
    }

    protected function clearApplicationCache(): void
    {
        $this->info('⚡ Clearing application cache...');

        $this->call('cache:clear');
        $this->call('optimize:clear');
        $this->line('✓ Application cache cleared');
    }

    protected function runTests(): void
    {
        $this->info('🧪 Running tests...');
        $this->call('test', ['--parallel' => true]);
        $this->line('✓ Tests completed');
    }

    protected function optimizeApplication(): void
    {
        $this->info('⚡ Optimizing application...');

        $this->call('optimize');

        $this->line('✓ Application optimized');
    }

    protected function displayAdminDetails(): void
    {
        $this->info('👤 Admin User Details:');
        $this->line('Email: superadmin@eshop.com');
        $this->line('Password: password');
    }
}
