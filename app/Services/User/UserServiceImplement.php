<?php

namespace App\Services\User;

use App\Http\Resources\UserResource;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
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
    public function getRegularUsers($request = null): UserServiceImplement
    {
        try {
            $users = $this->mainRepository->getRegularUsers($request);

            return $this->setCode(200)
                ->setMessage('Users retrieved successfully')
                ->setData([
                    'users' => UserResource::collection($users),
                    'pagination' => helpers()->queryableHelper()->getPagination($users),
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
    public function getAdminUsers($request = null): UserServiceImplement
    {
        try {
            $users = $this->mainRepository->getAdminUsers($request);
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
                    'pagination' => helpers()->queryableHelper()->getPagination($users),
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
        DB::beginTransaction();
        try {
            $user = $this->mainRepository->createAdmin($data);

            DB::commit();

            return $this->setCode(201)
                ->setMessage('Admin user created successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            DB::rollBack();

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
        DB::beginTransaction();
        try {
            $user = $this->mainRepository->find($id);

            if (! $user) {
                DB::rollBack();

                return $this->setCode(404)
                    ->setMessage('User not found');
            }

            if ($this->hasAdminRole($user)) {
                DB::rollBack();

                return $this->setCode(403)
                    ->setMessage('Cannot toggle active status for admin users');
            }

            $updated = $this->mainRepository->update($id, [
                'is_active' => ! $user->is_active,
            ]);
            $user = $this->mainRepository->find($id);

            DB::commit();

            return $this->setCode(200)
                ->setMessage('User status updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            DB::rollBack();

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
        DB::beginTransaction();
        try {
            $user = $this->mainRepository->find($id);

            if (! $user) {
                DB::rollBack();

                return $this->setCode(404)
                    ->setMessage('Admin not found');
            }

            $userRoles = $user->getRoleNames()->toArray();
            if (in_array('SUPER_ADMIN', $userRoles)) {
                DB::rollBack();

                return $this->setCode(403)
                    ->setMessage('Cannot toggle active status for super admin users');
            }

            if (! in_array('ADMIN', $userRoles)) {
                DB::rollBack();

                return $this->setCode(403)
                    ->setMessage('Can only toggle active status for admin users');
            }

            $updated = $this->mainRepository->update($id, [
                'is_active' => ! $user->is_active,
            ]);
            $user = $this->mainRepository->find($id);

            DB::commit();

            return $this->setCode(200)
                ->setMessage('Admin status updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            DB::rollBack();

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
        DB::beginTransaction();
        try {
            $user = $this->mainRepository->find($id);

            if (! $user) {
                DB::rollBack();

                return $this->setCode(404)
                    ->setMessage('User not found');
            }

            if ($this->hasAdminRole($user)) {
                DB::rollBack();

                return $this->setCode(403)
                    ->setMessage('Cannot update admin users from this page');
            }

            $updated = $this->mainRepository->update($id, $data);
            $user = $this->mainRepository->find($id);

            DB::commit();

            return $this->setCode(200)
                ->setMessage('User updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            DB::rollBack();

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
        DB::beginTransaction();
        try {
            $user = $this->mainRepository->find($id);

            if (! $user) {
                DB::rollBack();

                return $this->setCode(404)
                    ->setMessage('Admin not found');
            }

            $userRoles = $user->getRoleNames()->toArray();
            if (! in_array('ADMIN', $userRoles) || in_array('SUPER_ADMIN', $userRoles)) {
                DB::rollBack();

                return $this->setCode(403)
                    ->setMessage('Can only update admin users');
            }

            $updated = $this->mainRepository->update($id, $data);
            $user = $this->mainRepository->find($id);

            DB::commit();

            return $this->setCode(200)
                ->setMessage('Admin updated successfully')
                ->setData([
                    'user' => new UserResource($user->load('roles')),
                ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->setCode(500)
                ->setMessage('An error occurred while updating admin')
                ->setError($e->getMessage());
        }
    }

    /**
     * Check if a user has ADMIN or SUPER_ADMIN role.
     */
    private function hasAdminRole($user): bool
    {
        $userRoles = $user->getRoleNames()->toArray();

        return in_array('ADMIN', $userRoles) || in_array('SUPER_ADMIN', $userRoles);
    }
}
