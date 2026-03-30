<?php

namespace App\Providers;

use App\Services\PaymentService;
use Illuminate\Support\ServiceProvider;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\BalanceAndTransaction\BalanceApi;

class PaymentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(InvoiceApi::class, function ($app) {
            return new InvoiceApi();
        });
        $this->app->singleton(BalanceApi::class, function ($app) {
            return new BalanceApi();
        });
        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService(
                $app->make(InvoiceApi::class),
                $app->make(BalanceApi::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Configuration::setXenditKey(config('app.additional_config_files.xendit_secret_key'));
    }
}
