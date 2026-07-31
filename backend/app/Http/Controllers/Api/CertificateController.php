<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CertificateController extends Controller
{
    public function getApprovedCandidates()
    {
        $candidates = InternshipApplication::whereIn('status', ['Accepted', 'approved'])
            ->select('id', 'full_name', 'email', 'internship_domain', 'preferred_start_date', 'mobile', 'college_name')
            ->get();
        return response()->json($candidates, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'internship_application_id' => 'required|exists:internship_applications,id',
            'certificate_id'            => 'required|unique:certificates,certificate_id',
            'candidate_name'            => 'required|string|max:255',
            'domain'                    => 'required|string|max:255',
            'duration'                  => 'required|integer|min:1|max:12',
            'start_date'                => 'required|date',
            'end_date'                  => 'required|date|after:start_date',
            'issue_date'                => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $existingCertificate = Certificate::where('internship_application_id', $request->internship_application_id)->first();
        if ($existingCertificate) {
            return response()->json(['message' => 'Certificate already exists for this internship application'], 409);
        }
        try {
            $certificate = Certificate::create([
                'internship_application_id' => $request->internship_application_id,
                'certificate_id'            => $request->certificate_id,
                'candidate_name'            => $request->candidate_name,
                'domain'                    => $request->domain,
                'duration'                  => $request->duration,
                'start_date'                => $request->start_date,
                'end_date'                  => $request->end_date,
                'issue_date'                => $request->issue_date,
                'status'                    => 'approved',
            ]);
            return response()->json(['message' => 'Certificate saved successfully', 'data' => $certificate], 201);
        } catch (\Exception $e) {
            \Log::error('Certificate creation error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save certificate'], 500);
        }
    }

    public function checkDuplicate($internshipApplicationId)
    {
        $certificate = Certificate::where('internship_application_id', $internshipApplicationId)->first();
        if ($certificate) {
            return response()->json(['exists' => true, 'certificate' => $certificate], 200);
        }
        return response()->json(['exists' => false], 200);
    }

    public function verify($certificateId)
    {
        $certificate = Certificate::where('certificate_id', $certificateId)->first();
        if (!$certificate) {
            return response()->json(['message' => 'Certificate not found'], 404);
        }
        return response()->json(['valid' => true, 'certificate' => $certificate], 200);
    }

    public function generate($certificateId, Request $request)
    {
        $cleanId = trim((string) urldecode($certificateId));
        $durationInput = max(1, (int) $request->input('duration', $request->query('duration', 1)));

        \Log::info('Certificate generation request received for Application ID', [
            'raw_input'     => $certificateId,
            'cleaned_input' => $cleanId,
            'duration'      => $durationInput,
        ]);

        // Case-insensitive exact search on internship_applications table application_id column
        $application = InternshipApplication::select('id', 'application_id', 'full_name', 'college_name', 'internship_domain', 'duration', 'preferred_start_date', 'created_at')
            ->whereRaw('LOWER(TRIM(application_id)) = ?', [mb_strtolower($cleanId)])
            ->first();

        if (!$application) {
            // Direct equality fallback search
            $application = InternshipApplication::select('id', 'application_id', 'full_name', 'college_name', 'internship_domain', 'duration', 'preferred_start_date', 'created_at')
                ->where('application_id', $cleanId)
                ->first();
        }

        if (!$application && is_numeric($cleanId)) {
            $application = InternshipApplication::select('id', 'application_id', 'full_name', 'college_name', 'internship_domain', 'duration', 'preferred_start_date', 'created_at')
                ->find((int) $cleanId);
        }

        if (!$application) {
            try {
                // Search certificates table by certificate_id case-insensitively as secondary fallback
                $certificate = Certificate::with('internshipApplication:id,college_name')
                    ->whereRaw('LOWER(TRIM(certificate_id)) = ?', [mb_strtolower($cleanId)])
                    ->first();

                if ($certificate) {
                    \Log::info('Found certificate record in certificates table', ['certificate_id' => $certificate->certificate_id]);
                    $certDuration = max(1, (int) ($certificate->duration ?? 1));
                    $certEndDate = (string) \Carbon\Carbon::parse($certificate->start_date)->addMonths($certDuration)->toDateString();

                    return response()->json([
                        'status'      => 'approved',
                        'certificate' => [
                            'certificate_id' => $certificate->certificate_id,
                            'candidate_name' => $certificate->candidate_name,
                            'college_name'   => $certificate->internshipApplication->college_name ?? '',
                            'domain'         => $certificate->domain,
                            'duration'       => $certDuration,
                            'start_date'     => (string) $certificate->start_date,
                            'end_date'       => $certEndDate,
                            'issue_date'     => (string) $certificate->issue_date,
                            'status'         => 'approved',
                        ],
                    ], 200);
                }
            } catch (\Throwable $e) {
                \Log::warning('Certificates table fallback query skipped: ' . $e->getMessage());
            }

            \Log::warning('Application ID not found in database', ['searched_id' => $cleanId]);

            return response()->json([
                'status'  => 'invalid',
                'message' => 'Invalid Application ID. Please enter a valid Application ID.',
            ], 404);
        }

        $storedDuration = max(1, (int) ($application->duration ?? 1));

        \Log::info('Successfully retrieved student details for Application ID', [
            'application_id' => $application->application_id,
            'full_name'      => $application->full_name,
            'duration'       => $storedDuration,
        ]);

        $startDate = (string) ($application->preferred_start_date ?? now()->toDateString());
        $endDate   = (string) \Carbon\Carbon::parse($startDate)->addMonths($storedDuration)->toDateString();
        $issueDate = (string) ($application->created_at ? $application->created_at->toDateString() : now()->toDateString());

        return response()->json([
            'status'      => 'approved',
            'certificate' => [
                'certificate_id' => $application->application_id,
                'candidate_name' => $application->full_name,
                'college_name'   => $application->college_name ?? '',
                'domain'         => $application->internship_domain ?? 'Internship',
                'duration'       => $storedDuration,
                'start_date'     => $startDate,
                'end_date'       => $endDate,
                'issue_date'     => $issueDate,
                'status'         => 'approved',
            ],
        ], 200);
    }

    public function sendCertificateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'certificate_id' => 'required|exists:certificates,certificate_id',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $certificate = Certificate::with('internshipApplication')->where('certificate_id', $request->certificate_id)->first();
        if (!$certificate || !$certificate->internshipApplication) {
            return response()->json(['message' => 'Certificate or linked application not found'], 404);
        }
        try {
            \Mail::to($certificate->internshipApplication->email)->send(
                new \App\Mail\CertificateIssuedMail($certificate, $certificate->candidate_name)
            );
            return response()->json(['message' => 'Certificate email sent successfully'], 200);
        } catch (\Throwable $e) {
            \Log::error('Certificate email failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send certificate email'], 500);
        }
    }
}