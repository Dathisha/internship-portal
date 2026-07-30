<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InternshipApplicationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ApplicationActionController;

Route::get('/internship-applications', [InternshipApplicationController::class, 'index']);
Route::post('/internship-applications', [InternshipApplicationController::class, 'store']);
Route::post('/internship-applications/{id}/accept', [InternshipApplicationController::class, 'accept']);
Route::post('/internship-applications/{id}/reject', [InternshipApplicationController::class, 'reject']);
Route::post('/contact', [ContactController::class, 'store']);

// Certificate routes
Route::get('/approved-candidates', [CertificateController::class, 'getApprovedCandidates']);
Route::post('/certificates', [CertificateController::class, 'store']);
Route::get('/certificates/check/{internshipApplicationId}', [CertificateController::class, 'checkDuplicate']);
Route::get('/certificates/verify/{certificateId}', [CertificateController::class, 'verify']);
Route::get('/certificates/generate/{certificateId}', [CertificateController::class, 'generate']);
Route::post('/certificates/send-email', [CertificateController::class, 'sendCertificateEmail']);