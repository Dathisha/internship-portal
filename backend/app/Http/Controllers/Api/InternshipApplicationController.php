<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInternshipApplicationRequest;
use App\Mail\ApplicationAcceptedMail;
use App\Mail\ApplicationRejectedMail;
use App\Mail\InternshipApplicationMail;
use App\Models\InternshipApplication;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class InternshipApplicationController extends Controller
{
    public function index()
    {
        $applications = InternshipApplication::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success'      => true,
            'applications' => $applications,
        ]);
    }

    public function accept(string|int $id)
    {
        $application = is_numeric($id)
            ? InternshipApplication::find($id)
            : InternshipApplication::where('application_id', $id)->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.',
            ], 404);
        }

        if ($application->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => 'This application has already been processed.',
                'status'  => $application->status,
            ], 400);
        }

        $application->status = 'Accepted';
        $application->save();

        try {
            Mail::to($application->email)->send(new ApplicationAcceptedMail($application));
            Log::info('Acceptance email sent successfully.', [
                'application_id' => $application->application_id,
                'student_email'  => $application->email,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to send acceptance email.', [
                'application_id' => $application->application_id,
                'error'          => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success'     => true,
            'message'     => 'Application accepted successfully.',
            'application' => $application,
        ]);
    }

    public function reject(string|int $id)
    {
        $application = is_numeric($id)
            ? InternshipApplication::find($id)
            : InternshipApplication::where('application_id', $id)->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found.',
            ], 404);
        }

        if ($application->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => 'This application has already been processed.',
                'status'  => $application->status,
            ], 400);
        }

        $application->status = 'Rejected';
        $application->save();

        try {
            Mail::to($application->email)->send(new ApplicationRejectedMail($application));
            Log::info('Rejection email sent successfully.', [
                'application_id' => $application->application_id,
                'student_email'  => $application->email,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to send rejection email.', [
                'application_id' => $application->application_id,
                'error'          => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success'     => true,
            'message'     => 'Application rejected successfully.',
            'application' => $application,
        ]);
    }

    public function store(StoreInternshipApplicationRequest $request)
    {
        $startTime = microtime(true);

        try {
            $validated = $request->validated();

            // ── 1. Store uploaded resume file ────────────────────────────────
            $resumeFile         = $request->file('resume');
            $resumePath         = $resumeFile->store('resumes', 'local');
            $resumeOriginalName = $resumeFile->getClientOriginalName();
            $resumeSizeKb       = $resumeFile->getSize() ? round($resumeFile->getSize() / 1024, 2) : null;

            // ── 2. Create DB record ───────────────────────────────────────────
            $applicationId = $this->generateUniqueApplicationId();
            $application = InternshipApplication::create([
                'application_id'       => $applicationId,
                'full_name'            => $validated['full_name'],
                'email'                => $validated['email'],
                'mobile'               => $validated['mobile'],
                'college_name'         => $validated['college_name'],
                'department'           => $validated['department'],
                'current_year'         => $validated['current_year'],
                'internship_domain'    => $validated['internship_domain'],
                'internship_mode'      => $validated['internship_mode'],
                'duration'             => (int) $validated['duration'],
                'preferred_start_date' => $validated['preferred_start_date'],
                'resume_path'          => $resumePath,
                'linkedin_url'         => $validated['linkedin_url'] ?? null,
                'github_url'           => $validated['github_url'] ?? null,
                'motivation'           => $validated['motivation'],
                'status'               => 'Pending',
            ]);

            $elapsedMs = round((microtime(true) - $startTime) * 1000, 2);
            Log::info('Internship application stored in DB successfully.', [
                'application_id' => $applicationId,
                'db_save_ms'     => $elapsedMs,
            ]);

            // ── 3. Non-blocking background email dispatch ─────────────────────
            $this->sendEmailInBackground($application, $resumeOriginalName, $resumeSizeKb);

            return response()->json([
                'success'        => true,
                'message'        => 'Application submitted successfully',
                'application_id' => $applicationId,
            ], 201);

        } catch (\Throwable $e) {
            $elapsedMs = round((microtime(true) - $startTime) * 1000, 2);
            Log::error('Error storing internship application.', [
                'error'      => $e->getMessage(),
                'elapsed_ms' => $elapsedMs,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to submit application right now: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function sendEmailInBackground(InternshipApplication $application, string $resumeOriginalName, ?float $resumeSizeKb): void
    {
        register_shutdown_function(function () use ($application, $resumeOriginalName, $resumeSizeKb) {
            if (function_exists('fastcgi_finish_request')) {
                fastcgi_finish_request();
            }

            try {
                $recipient = config('mail.to') ?: 'intern2expert.portal@gmail.com';
                $appUrl = env('APP_URL') ?: config('app.url');
                if ($appUrl && str_starts_with($appUrl, 'http')) {
                    URL::forceRootUrl($appUrl);
                    if (str_starts_with($appUrl, 'https://')) {
                        URL::forceScheme('https');
                    }
                }

                $acceptUrl = URL::temporarySignedRoute(
                    'applications.accept',
                    now()->addDays(7),
                    ['token' => $application->application_id]
                );
                $rejectUrl = URL::temporarySignedRoute(
                    'applications.reject',
                    now()->addDays(7),
                    ['token' => $application->application_id]
                );

                Mail::to($recipient)->send(new InternshipApplicationMail(
                    $application,
                    ['original_name' => $resumeOriginalName, 'size_kb' => $resumeSizeKb],
                    $acceptUrl,
                    $rejectUrl
                ));

                Log::info('Background HR notification email sent successfully.', [
                    'application_id' => $application->application_id,
                    'recipient'      => $recipient,
                ]);
            } catch (\Throwable $exception) {
                Log::error('Background HR notification email failed to send.', [
                    'application_id' => $application->application_id,
                    'error'          => $exception->getMessage(),
                ]);
            }
        });
    }

    private function generateUniqueApplicationId(): string
    {
        $year = date('Y');
        $random = strtoupper(Str::random(4));
        $applicationId = "INTERN-{$year}-{$random}";

        if (InternshipApplication::where('application_id', $applicationId)->exists()) {
            $applicationId = "INTERN-{$year}-" . strtoupper(Str::random(6));
        }

        return $applicationId;
    }
}