<?php

namespace Tests\Feature;

use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryEndpointTest extends TestCase
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

    public function test_admin_can_view_categories_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.categories.index'));

        $response->assertOk();
    }

    public function test_guest_cannot_access_admin_categories(): void
    {
        $response = $this->get(route('admin.categories.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), [
                'name' => 'New Category',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('product_categories', ['name' => 'New Category']);
    }

    public function test_admin_can_create_subcategory(): void
    {
        $parent = ProductCategory::create([
            'name' => 'Parent Category',
            'slug' => 'parent-category',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), [
                'name' => 'Sub Category',
                'parent_id' => $parent->id,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('product_categories', [
            'name' => 'Sub Category',
            'parent_id' => $parent->id,
        ]);
    }

    public function test_admin_can_update_category(): void
    {
        $category = ProductCategory::create([
            'name' => 'Old Name',
            'slug' => 'old-name',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.categories.update', $category->id), [
                'name' => 'Updated Name',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('product_categories', ['name' => 'Updated Name']);
    }

    public function test_admin_can_delete_category(): void
    {
        $category = ProductCategory::create([
            'name' => 'To Delete',
            'slug' => 'to-delete',
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.categories.destroy', $category->id));

        $response->assertOk();
        $response->assertJson([
            'code' => 200,
            'message' => 'Category deleted successfully',
        ]);
        $this->assertSoftDeleted('product_categories', ['id' => $category->id]);
    }

    public function test_category_name_is_required(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), [
                'name' => '',
            ]);

        $response->assertSessionHasErrors('name');
    }
}
