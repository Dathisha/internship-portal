<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InternshipApplicationController;

Route::post('/internship-applications', [InternshipApplicationController::class, 'store']);