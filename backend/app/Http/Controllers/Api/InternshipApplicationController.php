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
        $validated = $request->validated();

        // ── 1. Store resume file ──────────────────────────────────────────
        $resumeFile         = $request->file('resume');
        $resumePath         = $resumeFile->store('resumes', 'local');
        $resumeOriginalName = $resumeFile->getClientOriginalName();
        $resumeSizeKb       = $resumeFile->getSize() ? round($resumeFile->getSize() / 1024, 2) : null;

        // ── 2. Create DB record ───────────────────────────────────────────
        $application = InternshipApplication::create([
            'application_id'       => $this->generateUniqueApplicationId(),
            'full_name'            => $validated['full_name'],
            'email'                => $validated['email'],
            'mobile'               => $validated['mobile'],
            'college_name'         => $validated['college_name'],
            'department'           => $validated['department'],
            'current_year'         => $validated['current_year'],
            'internship_domain'    => $validated['internship_domain'],
            'internship_mode'      => $validated['internship_mode'],
            'preferred_start_date' => $validated['preferred_start_date'],
            'resume_path'          => $resumePath,
            'linkedin_url'         => $validated['linkedin_url'] ?? null,
            'github_url'           => $validated['github_url'] ?? null,
            'motivation'           => $validated['motivation'],
            'status'               => 'Pending',
        ]);

        // ── 3. Send email to HR & log action ─────────────────────────────
        $recipient = config('mail.to') ?: 'intern2expert.portal@gmail.com';
        try {
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

            Log::info('Internship application created and HR notification email sent.', [
                'application_id' => $application->application_id,
                'student_name'   => $application->full_name,
                'student_email'  => $application->email,
                'recipient'      => $recipient,
                'submitted_at'   => $application->created_at->toDateTimeString(),
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to send internship application notification email to HR.', [
                'application_id' => $application->application_id,
                'error'          => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'success'        => true,
            'message'        => 'Application submitted successfully',
            'application_id' => $application->application_id,
        ], 201);
    }

    private function generateUniqueApplicationId(): string
    {
        do {
            $applicationId = 'INTERN-' . date('Y') . '-' . strtoupper(Str::random(4));
        } while (InternshipApplication::where('application_id', $applicationId)->exists());

        return $applicationId;
    }
}