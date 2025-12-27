<?php

namespace Database\Seeders;

use App\Enum\PermissionEnum;
use App\Enum\UserRoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (PermissionEnum::cases() as $permission) {
            Permission::firstOrCreate([
                'name' => $permission->name,
                'guard_name' => 'web',
            ]);
        }

        foreach (UserRoleEnum::cases() as $role) {
            Role::firstOrCreate([
                'name' => $role->name,
                'guard_name' => 'web',
            ]);
        }

        $superAdmin = Role::findByName(UserRoleEnum::SUPER_ADMIN->name);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::findByName(UserRoleEnum::ADMIN->name);
        $admin->givePermissionTo([
            PermissionEnum::VIEW_DASHBOARD->name,
            PermissionEnum::VIEW_ANALYTICS->name,
            PermissionEnum::VIEW_REPORTS->name,
            PermissionEnum::VIEW_USERS->name,
            PermissionEnum::CREATE_USERS->name,
            PermissionEnum::EDIT_USERS->name,
            PermissionEnum::VIEW_PRODUCTS->name,
            PermissionEnum::CREATE_PRODUCTS->name,
            PermissionEnum::EDIT_PRODUCTS->name,
            PermissionEnum::DELETE_PRODUCTS->name,
            PermissionEnum::MANAGE_PRODUCT_CATEGORIES->name,
            PermissionEnum::MANAGE_PRODUCT_STOCK->name,
            PermissionEnum::VIEW_ORDERS->name,
            PermissionEnum::PROCESS_ORDERS->name,
            PermissionEnum::REFUND_ORDERS->name,
            PermissionEnum::VIEW_SETTINGS->name,
            PermissionEnum::VIEW_CONTENT->name,
            PermissionEnum::CREATE_CONTENT->name,
            PermissionEnum::EDIT_CONTENT->name,
            PermissionEnum::PUBLISH_CONTENT->name,
            PermissionEnum::VIEW_SALES_REPORTS->name,
            PermissionEnum::VIEW_PRODUCT_REPORTS->name,
        ]);
    }
}
