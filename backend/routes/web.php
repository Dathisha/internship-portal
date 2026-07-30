<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApplicationActionController;

Route::get('/', function () {
    return view('welcome');
});

// HR action routes — signed URLs sent inside the application notification email
Route::get('/application/accept/{token}', [ApplicationActionController::class, 'accept'])
    ->name('applications.accept');

Route::get('/application/reject/{token}', [ApplicationActionController::class, 'reject'])
    ->name('applications.reject');