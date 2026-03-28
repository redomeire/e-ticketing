<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:release-expired-order')->everyFiveMinutes();

Schedule::command('backup:run')->dailyAt('01:00');

Schedule::command('telescope:prune')->daily();