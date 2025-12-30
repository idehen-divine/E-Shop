<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display a listing of users.
     *
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $response = $this->userService->getRegularUsers($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $response->toJson();
        }

        return Inertia::render('admin/users/index', [
            'users' => json_decode($response->toJson()->getContent(), true),
        ]);
    }

    /**
     * Display a listing of admins (excluding SUPER_ADMIN).
     *
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function admins(Request $request)
    {
        $response = $this->userService->getAdminUsers($request);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $response->toJson();
        }

        return Inertia::render('admin/admins/index', [
            'admins' => json_decode($response->toJson()->getContent(), true),
        ]);
    }

    /**
     * Store a newly created admin user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function store(StoreAdminRequest $request)
    {
        $result = $this->userService->createAdmin($request->validated());

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin user created successfully.');
    }

    /**
     * Toggle the active status of a user.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function toggleActive(Request $request, string $id)
    {
        $result = $this->userService->toggleUserActive($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User status updated successfully.');
    }

    /**
     * Toggle the active status of an admin user.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function toggleAdminActive(Request $request, string $id)
    {
        $result = $this->userService->toggleAdminActive($id);

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin status updated successfully.');
    }

    /**
     * Update the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $result = $this->userService->updateUser($id, $request->validated());

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Update the specified admin user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function updateAdmin(UpdateUserRequest $request, string $id)
    {
        $result = $this->userService->updateAdmin($id, $request->validated());

        if ($request->expectsJson() || $request->is('api/*')) {
            return $result->toJson();
        }

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin updated successfully.');
    }
}
