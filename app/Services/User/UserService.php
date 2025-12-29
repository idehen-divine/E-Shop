<?php

namespace App\Services\User;

use LaravelEasyRepository\BaseService;

interface UserService extends BaseService
{
    public function getRegularUsers();

    public function getAdminUsers();

    public function createAdmin(array $data);

    public function toggleUserActive(string $id);

    public function updateUser(string $id, array $data);

    public function updateAdmin(string $id, array $data);
}
