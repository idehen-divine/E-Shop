<?php

namespace App\Repositories\User;

use App\Models\User;
use LaravelEasyRepository\Implementations\Eloquent;

class UserRepositoryImplement extends Eloquent implements UserRepository
{
    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     *
     * @property User|mixed $model;
     */
    protected User $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    /**
     * Get all regular users (excluding ADMIN and SUPER_ADMIN).
     */
    public function getRegularUsers()
    {
        return $this->model->with('roles')
            ->whereDoesntHave('roles', function ($query) {
                $query->whereIn('name', ['SUPER_ADMIN', 'ADMIN']);
            })
            ->get();
    }

    /**
     * Get all admin users (excluding SUPER_ADMIN).
     */
    public function getAdminUsers()
    {
        return $this->model->with('roles')
            ->whereHas('roles', function ($query) {
                $query->where('name', 'ADMIN');
            })
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'SUPER_ADMIN');
            })
            ->get();
    }

    /**
     * Get available roles excluding specified role names.
     *
     * @param  array<string>  $excludedRoles
     */
    public function getAvailableRoles(array $excludedRoles = [])
    {
        return \Spatie\Permission\Models\Role::where('guard_name', 'web')
            ->whereNotIn('name', $excludedRoles)
            ->get();
    }
}
