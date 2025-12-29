<?php

namespace App\Repositories\User;

use LaravelEasyRepository\Repository;

interface UserRepository extends Repository
{
    public function getRegularUsers();

    public function getAdminUsers();

    public function getAvailableRoles(array $excludedRoles = []);
}
