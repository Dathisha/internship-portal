<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule Monthly Company Report to run automatically at the end of every month
Schedule::command('reports:send-monthly')->lastDayOfMonth('23:59');

