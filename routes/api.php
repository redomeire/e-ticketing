<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::middleware(['auth:sanctum', 'abilities:profile-manage'])
            ->group(function () {
                Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            });
        Route::middleware(['guest'])
            ->group(function () {
                Route::post('register', [AuthController::class, 'register'])->name('register');
                Route::post('login', [AuthController::class, 'login'])->name('login');
            });
    });
});
