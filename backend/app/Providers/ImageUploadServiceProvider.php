<?php

namespace App\Providers;

use App\Services\ImageUploadService;
use Illuminate\Support\ServiceProvider;
use ImageKit\ImageKit;

class ImageUploadServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageUploadService::class, function ($app) {
            $image_kit = new ImageKit(
                config('app.additional_config_files.imagekit_public_key'),
                config('app.additional_config_files.imagekit_private_key'),
                config('app.additional_config_files.imagekit_url_endpoint')
            );
            return new ImageUploadService($image_kit);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
