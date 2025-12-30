<?php

namespace App\Repositories\User;

use App\Models\User;
use LaravelEasyRepository\Repository;

interface UserRepository extends Repository
{
    public function getRegularUsers($request = null);

    public function getAdminUsers($request = null);

    public function getAvailableRoles(array $excludedRoles = []);

    public function createAdmin(array $data): User;
}
