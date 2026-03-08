<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
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
        Route::get('/{slug}', [EventController::class, 'show'])->name('event.show');
        Route::middleware(['auth:sanctum', 'abilities:event-view'])
            ->group(function () {
                Route::get('/orders', [OrderController::class, 'all'])->name('event.orders');
                Route::get('/orders/{id}', [OrderController::class, 'repay'])->name('event.orders.repay');
                Route::get('/attendee', [EventController::class, 'getAttendees'])->name('event.attendees');
                Route::get('/{event_id}/seats', [EventController::class, 'getSeats'])->name('event.seats');
                Route::post('/seats/checkout', [OrderController::class, 'checkout'])->name('event.seats.checkout');
            });
        Route::middleware(['auth:sanctum', 'abilities:event-manage'])
            ->group(function () {
                Route::post('/', [EventController::class, 'store'])->name('event.store');
                Route::put('/{id}', [EventController::class, 'update'])->name('event.update');
                Route::delete('/{id}', [EventController::class, 'destroy'])->name('event.destroy');
                Route::get('/category/{event_id}', [EventController::class, 'getCategory'])->name('event.category');
                Route::put('/category/{id}', [EventController::class, 'updateCategory'])->name('event.category.update');
                Route::delete('/category/{id}', [EventController::class, 'destroyCategory'])->name('event.category.destroy');
                Route::post('/seats', [EventController::class, 'storeSeats'])->name('event.seats.store');
                Route::delete('/seats/{id}', [EventController::class, 'destroySeat'])->name('event.seats.destroy');
            });
    });
});
