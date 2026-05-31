<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'System Admin',
                'phone' => '9999999999',
                'role_id' => $adminRole?->id,
                'password' => 'Admin@123',
            ]
        );
    }
}
