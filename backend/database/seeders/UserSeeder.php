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
        // admins
        User::create([
            'name' => 'Super Admin',
            'email' => config('app.additional_config_files.superadmin_email'),
            'role' => 'superadmin',
            'email_verified_at' => now(),
            'is_active' => true,
            'password' => Hash::make(config('app.additional_config_files.superadmin_password')),
        ]);
        User::create([
            'name' => 'Admin',
            'email' => config('app.additional_config_files.admin_email'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => true,
            'password' => Hash::make(config('app.additional_config_files.admin_password')),
        ]);
        // user
        User::create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'role' => 'user',
            'email_verified_at' => now(),
            'is_active' => true,
            'password' => Hash::make('testpassword'),
        ]);
    }
}
