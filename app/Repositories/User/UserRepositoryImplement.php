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
    public function getRegularUsers($request = null)
    {
        $request = $request ?? request();
        if (! $request->has('per_page')) {
            $request->merge(['per_page' => 10]);
        }

        return helpers()->queryableHelper()->fetchWithFilters($this->model, function ($query) use ($request) {
            $query->with('roles');

            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('email', 'like', '%'.$request->search.'%');
                });
            }

            if ($request->filled('status') && $request->status !== 'all') {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            if ($request->filled('verified') && $request->verified !== 'all') {
                if ($request->verified === 'verified') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($request->verified === 'unverified') {
                    $query->whereNull('email_verified_at');
                }
            }

            $query->whereDoesntHave('roles', function ($query) {
                $query->whereIn('name', ['SUPER_ADMIN', 'ADMIN']);
            });
        });
    }

    /**
     * Get all admin users (excluding SUPER_ADMIN).
     */
    public function getAdminUsers($request = null)
    {
        $request = $request ?? request();
        if (! $request->has('per_page')) {
            $request->merge(['per_page' => 10]);
        }

        return helpers()->queryableHelper()->fetchWithFilters($this->model, function ($query) use ($request) {
            $query->with('roles');

            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('email', 'like', '%'.$request->search.'%');
                });
            }

            if ($request->filled('status') && $request->status !== 'all') {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            if ($request->filled('verified') && $request->verified !== 'all') {
                if ($request->verified === 'verified') {
                    $query->whereNotNull('email_verified_at');
                } elseif ($request->verified === 'unverified') {
                    $query->whereNull('email_verified_at');
                }
            }

            $query->whereHas('roles', function ($query) {
                $query->where('name', 'ADMIN');
            })
                ->whereDoesntHave('roles', function ($query) {
                    $query->where('name', 'SUPER_ADMIN');
                });
        });
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

    /**
     * Create a new admin user with role assignment.
     *
     * @param  array<string, mixed>  $data
     */
    public function createAdmin(array $data): User
    {
        $user = $this->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        if (! $user instanceof User) {
            throw new \Exception('Failed to create user');
        }

        $refreshed = $user->fresh();
        if ($refreshed) {
            $user = $refreshed;
        }

        $user->assignRole($data['role']);

        return $user;
    }

    /**
     * Get dashboard statistics for users
     */
    public function getDashboardStats(): array
    {
        return [
            'total' => $this->model->whereHas('roles', function ($query) {
                $query->where('name', 'USER');
            })->count(),
            'active' => $this->model->whereHas('roles', function ($query) {
                $query->where('name', 'USER');
            })->where('is_active', true)->count(),
        ];
    }

    /**
     * Get recent users
     */
    public function getRecentUsers(int $limit = 5): array
    {
        return $this->model
            ->whereHas('roles', function ($query) {
                $query->where('name', 'USER');
            })
            ->latest()
            ->take($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            })
            ->toArray();
    }
}
