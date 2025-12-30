<?php

namespace App\Services\User;

use LaravelEasyRepository\BaseService;

interface UserService extends BaseService
{
    public function getRegularUsers($request = null);

    public function getAdminUsers($request = null);

    public function createAdmin(array $data);

    public function toggleUserActive(string $id);

    public function toggleAdminActive(string $id);

    public function updateUser(string $id, array $data);

    public function updateAdmin(string $id, array $data);
}
