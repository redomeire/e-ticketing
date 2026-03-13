<?php

namespace App\Providers;

use App\Models\EventSeat;
use App\Models\Order;
use App\Models\User;
use App\Observers\EventSeatObserver;
use App\Observers\OrderObserver;
use App\Observers\UserObserver;
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
    }
}
