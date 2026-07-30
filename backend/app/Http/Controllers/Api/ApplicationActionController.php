<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ApplicationAcceptedMail;
use App\Mail\ApplicationRejectedMail;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class ApplicationActionController extends Controller
{
    public function accept(Request $request, string $token)
    {
        $appUrl = env('APP_URL') ?: config('app.url');
        if ($appUrl && str_starts_with($appUrl, 'http')) {
            URL::forceRootUrl($appUrl);
            if (str_starts_with($appUrl, 'https://')) {
                URL::forceScheme('https');
            }
        }

        Log::info('Accept action requested', [
            'token'    => $token,
            'ip'       => $request->ip(),
            'full_url' => $request->fullUrl(),
        ]);

        if (!URL::hasValidSignature($request, false) && !$request->hasValidSignature()) {
            Log::warning('Invalid or expired signature for accept action', [
                'token'     => $token,
                'full_url'  => $request->fullUrl(),
                'url'       => $request->url(),
                'signature' => $request->query('signature'),
            ]);
            return $this->errorPage('This link is invalid or has expired.');
        }

        $application = InternshipApplication::where('application_id', $token)->first();
        if (!$application) {
            Log::warning('Application not found for accept action', ['token' => $token]);
            return $this->errorPage('Application not found.');
        }

        if ($application->status !== 'Pending') {
            Log::info('Accept action ignored: application already processed', [
                'token'  => $token,
                'status' => $application->status,
            ]);
            return $this->actionPage('This application has already been processed.', "The application for {$application->full_name} has already been processed (Current Status: {$application->status}).", '#2563eb');
        }

        $application->status = 'Accepted';
        $application->save();

        Log::info('Application status updated to Accepted', [
            'application_id' => $application->application_id,
            'student_name'   => $application->full_name,
            'student_email'  => $application->email,
        ]);

        try {
            Mail::to($application->email)->send(new ApplicationAcceptedMail($application));
            Log::info('Acceptance email sent to applicant', [
                'application_id' => $application->application_id,
                'student_email'  => $application->email,
            ]);
        } catch (\Throwable $e) {
            Log::error('Acceptance email failed to send', [
                'application_id' => $application->application_id,
                'error'          => $e->getMessage(),
            ]);
        }

        return $this->actionPage('Application Accepted Successfully', "You have accepted {$application->full_name}'s internship application. A confirmation email has been sent to {$application->email}.", '#16a34a');
    }

    public function reject(Request $request, string $token)
    {
        $appUrl = env('APP_URL') ?: config('app.url');
        if ($appUrl && str_starts_with($appUrl, 'http')) {
            URL::forceRootUrl($appUrl);
            if (str_starts_with($appUrl, 'https://')) {
                URL::forceScheme('https');
            }
        }

        Log::info('Reject action requested', [
            'token'    => $token,
            'ip'       => $request->ip(),
            'full_url' => $request->fullUrl(),
        ]);

        if (!URL::hasValidSignature($request, false) && !$request->hasValidSignature()) {
            Log::warning('Invalid or expired signature for reject action', [
                'token'     => $token,
                'full_url'  => $request->fullUrl(),
                'url'       => $request->url(),
                'signature' => $request->query('signature'),
            ]);
            return $this->errorPage('This link is invalid or has expired.');
        }

        $application = InternshipApplication::where('application_id', $token)->first();
        if (!$application) {
            Log::warning('Application not found for reject action', ['token' => $token]);
            return $this->errorPage('Application not found.');
        }

        if ($application->status !== 'Pending') {
            Log::info('Reject action ignored: application already processed', [
                'token'  => $token,
                'status' => $application->status,
            ]);
            return $this->actionPage('This application has already been processed.', "The application for {$application->full_name} has already been processed (Current Status: {$application->status}).", '#dc2626');
        }

        $application->status = 'Rejected';
        $application->save();

        Log::info('Application status updated to Rejected', [
            'application_id' => $application->application_id,
            'student_name'   => $application->full_name,
            'student_email'  => $application->email,
        ]);

        try {
            Mail::to($application->email)->send(new ApplicationRejectedMail($application));
            Log::info('Rejection email sent to applicant', [
                'application_id' => $application->application_id,
                'student_email'  => $application->email,
            ]);
        } catch (\Throwable $e) {
            Log::error('Rejection email failed to send', [
                'application_id' => $application->application_id,
                'error'          => $e->getMessage(),
            ]);
        }

        return $this->actionPage('Application Rejected Successfully', "You have rejected {$application->full_name}'s internship application. A notification email has been sent to {$application->email}.", '#dc2626');
    }

    private function actionPage(string $title, string $body, string $colour): \Illuminate\Http\Response
    {
        $html = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>{$title}</title>"
            . "<style>body{font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}"
            . ".card{background:#fff;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 20px 40px rgba(15,23,42,.08);padding:48px 36px;max-width:500px;width:100%;text-align:center}"
            . ".icon{width:64px;height:64px;border-radius:50%;background:{$colour};display:inline-flex;align-items:center;justify-content:center;margin:0 auto 24px}"
            . ".icon svg{width:32px;height:32px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}"
            . "h1{font-size:22px;color:#0f172a;margin:0 0 12px;font-weight:700}p{color:#475569;line-height:1.7;font-size:15px;margin:0 0 24px}"
            . ".brand{margin-top:32px;padding-top:24px;border-top:1px solid #f1f5f9;font-size:13px;color:#94a3b8}.brand strong{color:#334155}</style></head>"
            . "<body><div class='card'><div class='icon' style='background:{$colour}'>"
            . "<svg viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg></div>"
            . "<h1>{$title}</h1><p>{$body}</p>"
            . "<div class='brand'><strong>Crescent Technosoft</strong> | Intern2Expert Portal</div>"
            . "</div></body></html>";
        return response($html, 200)->header('Content-Type', 'text/html');
    }

    private function errorPage(string $message): \Illuminate\Http\Response
    {
        $html = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Action Error</title>"
            . "<style>body{font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}"
            . ".card{background:#fff;border-radius:16px;border:1px solid #fee2e2;box-shadow:0 20px 40px rgba(15,23,42,.08);padding:48px 36px;max-width:500px;width:100%;text-align:center}"
            . ".icon{width:64px;height:64px;border-radius:50%;background:#ef4444;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 24px}"
            . ".icon svg{width:32px;height:32px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}"
            . "h1{font-size:20px;color:#991b1b;margin:0 0 12px;font-weight:700}p{color:#475569;line-height:1.7;font-size:15px;margin:0 0 24px}"
            . ".brand{margin-top:32px;padding-top:24px;border-top:1px solid #f1f5f9;font-size:13px;color:#94a3b8}.brand strong{color:#334155}</style></head>"
            . "<body><div class='card'><div class='icon'>"
            . "<svg viewBox='0 0 24 24'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg></div>"
            . "<h1>Action Link Error</h1><p>{$message}</p>"
            . "<div class='brand'><strong>Crescent Technosoft</strong> | Intern2Expert Portal</div>"
            . "</div></body></html>";
        return response($html, 403)->header('Content-Type', 'text/html');
    }
}