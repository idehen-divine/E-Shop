<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserEndpointTest extends TestCase
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

    public function test_admin_can_view_users_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));

        $response->assertOk();
    }

    public function test_guest_cannot_access_admin_users(): void
    {
        $response = $this->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_update_user(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.users.update', $user->id), [
                'name' => 'Updated Name',
                'email' => $user->email,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
    }

    public function test_admin_can_toggle_user_active_status(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->admin)
            ->patch("/admin/users/{$user->id}/toggle-active");

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_view_admins_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.admins.index'));

        $response->assertOk();
    }

    public function test_admin_can_create_admin_user(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.admins.store'), [
                'name' => 'New Admin',
                'email' => 'newadmin@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'ADMIN',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'newadmin@test.com']);
    }

    public function test_admin_can_update_admin_user(): void
    {
        $adminUser = User::factory()->create(['name' => 'Old Admin']);
        $adminUser->assignRole('ADMIN');

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.admins.update', $adminUser->id), [
                'name' => 'Updated Admin',
                'email' => $adminUser->email,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['name' => 'Updated Admin']);
    }

    public function test_admin_can_toggle_admin_active_status(): void
    {
        $adminUser = User::factory()->create(['is_active' => true]);
        $adminUser->assignRole('ADMIN');

        $response = $this->actingAs($this->admin)
            ->patch("/admin/admins/{$adminUser->id}/toggle-active");

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseHas('users', [
            'id' => $adminUser->id,
            'is_active' => false,
        ]);
    }
}
