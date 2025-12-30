<?php

namespace Database\Seeders;

use App\Enum\UserRoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(5)
            ->create()
            ->each(function (User $user) {
                $user->setRole(UserRoleEnum::ADMIN);
            });

        User::factory()
            ->count(50)
            ->create()
            ->each(function (User $user) {
                $user->setRole(UserRoleEnum::USER);
            });
    }
}
