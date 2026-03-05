<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => config('app.additional_config_files.superadmin_email'),
            'role' => 'superadmin',
            'password' => Hash::make(config('app.additional_config_files.superadmin_password')),
        ]);
        User::create([
            'name' => 'Admin',
            'email' => config('app.additional_config_files.admin_email'),
            'role' => 'admin',
            'password' => Hash::make(config('app.additional_config_files.admin_password')),
        ]);
    }
}
