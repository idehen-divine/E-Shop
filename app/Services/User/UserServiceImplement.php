<?php

namespace App\Services\User;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\User\UserRepository;
use LaravelEasyRepository\ServiceApi;

class UserServiceImplement extends ServiceApi implements UserService
{
    /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
    protected UserRepository $mainRepository;

    public function __construct(UserRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    /**
     * Get all regular users (excluding ADMIN and SUPER_ADMIN).
     */
    public function getRegularUsers(): UserServiceImplement
    {
        try {
            $users = $this->mainRepository->getRegularUsers();

            return $this->setCode(200)
                ->setMessage('Users retrieved successfully')
                ->setData([
                    'users' => UserResource::collection($users),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving users')
                ->setError($e->getMessage());
        }
    }

    /**
     * Get all admin users (excluding SUPER_ADMIN) with available roles.
     */
    public function getAdminUsers(): UserServiceImplement
    {
        try {
            $users = $this->mainRepository->getAdminUsers();
            $roles = $this->mainRepository->getAvailableRoles(['SUPER_ADMIN', 'USER']);

            $rolesArray = $roles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ])->toArray();

            $manageRoles = $this->mainRepository->getAvailableRoles(['SUPER_ADMIN', 'USER', 'ADMIN']);
            $manageRolesArray = $manageRoles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ])->toArray();

            return $this->setCode(200)
                ->setMessage('Admins retrieved successfully')
                ->setData([
                    'users' => UserResource::collection($users),
                    'roles' => $rolesArray,
                    'manageRoles' => $manageRolesArray,
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while retrieving admins')
                ->setError($e->getMessage());
        }
    }

    /**
     * Create a new admin user.
     */
    public function createAdmin(array $data): UserServiceImplement
    {
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $user->assignRole($data['role']);

            return $this->setCode(201)
                ->setMessage('Admin user created successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while creating admin user')
                ->setError($e->getMessage());
        }
    }

    /**
     * Toggle the active status of a user.
     */
    public function toggleUserActive(string $id): UserServiceImplement
    {
        try {
            $user = User::findOrFail($id);

            if ($this->hasAdminRole($user)) {
                return $this->setCode(403)
                    ->setMessage('Cannot toggle active status for admin users');
            }

            $user->update([
                'is_active' => ! $user->is_active,
            ]);

            return $this->setCode(200)
                ->setMessage('User status updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating user status')
                ->setError($e->getMessage());
        }
    }

    /**
     * Toggle the active status of an admin user.
     */
    public function toggleAdminActive(string $id): UserServiceImplement
    {
        try {
            $user = User::findOrFail($id);

            $userRoles = $user->getRoleNames()->toArray();
            if (in_array('SUPER_ADMIN', $userRoles)) {
                return $this->setCode(403)
                    ->setMessage('Cannot toggle active status for super admin users');
            }

            if (! in_array('ADMIN', $userRoles)) {
                return $this->setCode(403)
                    ->setMessage('Can only toggle active status for admin users');
            }

            $user->update([
                'is_active' => ! $user->is_active,
            ]);

            return $this->setCode(200)
                ->setMessage('Admin status updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating admin status')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update a regular user.
     */
    public function updateUser(string $id, array $data): UserServiceImplement
    {
        try {
            $user = User::findOrFail($id);

            if ($this->hasAdminRole($user)) {
                return $this->setCode(403)
                    ->setMessage('Cannot update admin users from this page');
            }

            $this->updateUserAttributes($user, $data);

            return $this->setCode(200)
                ->setMessage('User updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating user')
                ->setError($e->getMessage());
        }
    }

    /**
     * Update an admin user.
     */
    public function updateAdmin(string $id, array $data): UserServiceImplement
    {
        try {
            $user = User::findOrFail($id);

            $userRoles = $user->getRoleNames()->toArray();
            if (! in_array('ADMIN', $userRoles) || in_array('SUPER_ADMIN', $userRoles)) {
                return $this->setCode(403)
                    ->setMessage('Can only update admin users');
            }

            $this->updateUserAttributes($user, $data);

            return $this->setCode(200)
                ->setMessage('Admin updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            return $this->setCode(500)
                ->setMessage('An error occurred while updating admin')
                ->setError($e->getMessage());
        }
    }

    /**
     * Check if a user has ADMIN or SUPER_ADMIN role.
     */
    private function hasAdminRole(User $user): bool
    {
        $userRoles = $user->getRoleNames()->toArray();

        return in_array('ADMIN', $userRoles) || in_array('SUPER_ADMIN', $userRoles);
    }

    /**
     * Update user attributes and reset email verification if email changed.
     */
    private function updateUserAttributes(User $user, array $attributes): void
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}
