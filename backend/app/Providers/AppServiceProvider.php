<?php

namespace App\Providers;

use App\Models\EventSeat;
use App\Models\Order;
use App\Models\User;
use App\Observers\EventSeatObserver;
use App\Observers\OrderObserver;
use App\Observers\UserObserver;
use App\Services\AutoRefreshingDropBoxTokenService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;
use League\Flysystem\Filesystem;
use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter;

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
        Storage::extend('dropbox', function ($app, $config) {
            $adapter = new DropboxAdapter(new DropboxClient(
                new AutoRefreshingDropBoxTokenService()
            ));

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config
            );
        });
    }
}
