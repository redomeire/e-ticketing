<?php

namespace App\Providers;

use App\Models\EventSeat;
use App\Models\Order;
use App\Models\User;
use App\Observers\EventSeatObserver;
use App\Observers\OrderObserver;
use App\Observers\UserObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Order::observe(OrderObserver::class);
        EventSeat::observe(EventSeatObserver::class);
        User::observe(UserObserver::class);
        RateLimiter::for('login', function () {
            return Limit::perMinute(5)->by(request()->email ?: request()->ip());
        });
        RateLimiter::for('register', function () {
            return Limit::perHour(3)->by(request()->email ?: request()->ip());
        });
        RateLimiter::for('password-forgot', function () {
            return Limit::perMinutes(5, 1)->by(request()->email ?: request()->ip());
        });
        RateLimiter::for('password-reset', function () {
            return Limit::perMinutes(1, 1)->by(request()->email ?: request()->ip());
        });
        RateLimiter::for('send-verification-email', function () {
            return Limit::perMinutes(30, 3)->by(request()->email ?: request()->ip());
        });
    }
}
