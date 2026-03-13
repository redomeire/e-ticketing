<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckUserActive;
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

    Route::prefix('event')->group(function () {
        Route::post('/seats/checkout/webhook', [OrderController::class, 'checkoutWebhook'])->name('event.seats.checkout.webhook');
        Route::get('/', [EventController::class, 'all'])->name('event.all');
        Route::get('/categories', [EventController::class, 'getEventCategories'])->name('event.categories');
        Route::middleware(['auth:sanctum', CheckUserActive::class])->group(function () {
            Route::prefix('orders')->group(function () {
                Route::get('/', [OrderController::class, 'all'])->name('event.orders');
                Route::get('/{id}', [OrderController::class, 'show'])->name('event.orders.show');
            });
            Route::get('/attendee', [EventController::class, 'getAttendees'])->name('event.attendees');
            Route::get('/{slug}/seats', [EventController::class, 'getSeats'])->name('event.seats');
            Route::post('/seats/checkout', [OrderController::class, 'checkout'])->name('event.seats.checkout');

            Route::prefix('profile')->group(function () {
                Route::get('/', [ProfileController::class, 'show'])->name('profile.show');
                Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
                Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
            });

            Route::prefix('admin')->group(function () {
                Route::middleware(['abilities:event-manage'])->group(function () {
                    Route::get('/', [EventController::class, 'adminGetEvents'])->name('event.admin.index');
                    Route::post('/seats', [EventController::class, 'storeSeats'])->name('event.seats.store');
                    Route::post('/', [EventController::class, 'store'])->name('event.store');
                    Route::put('/{id}', [EventController::class, 'update'])->name('event.update');
                    Route::put('/{id}/toggle', [EventController::class, 'adminToggleEventActive'])->name('event.update.toggle');
                    Route::put('/{slug}/seats', [EventController::class, 'updateSeats'])->name('event.seats.update');
                    Route::delete('/{id}', [EventController::class, 'destroy'])->name('event.destroy');
                    Route::post('/category', [EventController::class, 'adminStoreEventCategory'])->name('event.category.store');
                    Route::put('/category/{id}', [EventController::class, 'updateTicketCategory'])->name('event.category.update');
                    Route::delete('/category/{id}', [EventController::class, 'destroyCategory'])->name('event.category.destroy');
                    Route::delete('/seats/{id}', [EventController::class, 'destroySeat'])->name('event.seats.destroy');
                    Route::get('/category/{event_id}', [EventController::class, 'getCategory'])->name('event.category');
                    Route::get('/users', [UserController::class, 'index'])->name('event.users');
                    Route::patch('/users/{id}', [UserController::class, 'update'])->name('event.users.patch');
                });
            });
        });
        Route::get('/{slug}', [EventController::class, 'show'])->name('event.show');
    });
});