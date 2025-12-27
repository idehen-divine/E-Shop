<?php

namespace App\Http\Responses;

use App\Enum\UserRoleEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        $user = auth()->user();

        if ($user->hasAnyRole([UserRoleEnum::SUPER_ADMIN->name, UserRoleEnum::ADMIN->name])) {
            return redirect()->intended('/dashboard');
        }

        return redirect()->intended('/');
    }
}
