<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/telescope-login', [AuthController::class, 'telescopeLoginForm'])
    ->name('telescope.login');

Route::post('/telescope-login', [AuthController::class, 'telescopeLogin'])
    ->name('telescope.login.post');

Route::get('/telescope-logout', [AuthController::class, 'telescopeLogout'])->name('telescope.logout');
