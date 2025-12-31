<?php

namespace Tests\Feature;

use App\Enum\UserRoleEnum;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('SUPER_ADMIN');

        $this->actingAs($user)->get(route('dashboard'))->assertOk();
    }

    public function test_dashboard_returns_correct_statistics(): void
    {
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole(UserRoleEnum::SUPER_ADMIN->name);

        // Create test data
        Product::factory()->count(5)->create(['is_active' => true]);
        Product::factory()->count(2)->create(['is_active' => false]);
        Product::factory()->count(2)->create(['stock' => 5, 'is_active' => true]); // Low stock
        Product::factory()->count(1)->create(['stock' => 0]); // Out of stock

        ProductCategory::factory()->count(3)->create();

        $regularUser = User::factory()->create();
        $regularUser->assignRole(UserRoleEnum::USER->name);

        $response = $this->actingAs($admin)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('dashboard')
        );
    }

    public function test_non_admin_users_cannot_access_dashboard(): void
    {
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole(UserRoleEnum::USER->name);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertStatus(404);
    }
}
