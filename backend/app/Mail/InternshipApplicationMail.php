<?php

namespace App\Mail;

use App\Models\InternshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class InternshipApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public InternshipApplication $application;
    public array $resumeInfo;
    public string $acceptUrl;
    public string $rejectUrl;

    public function __construct(
        InternshipApplication $application,
        array $resumeInfo = [],
        string $acceptUrl = '',
        string $rejectUrl = ''
    ) {
        $this->application = $application;
        $this->resumeInfo  = $resumeInfo;
        $this->acceptUrl   = $acceptUrl;
        $this->rejectUrl   = $rejectUrl;
    }

    public function build()
    {
        $mail = $this
            ->subject('New Internship Application — ' . $this->application->full_name)
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.internship_application')
            ->with([
                'application' => $this->application,
                'resumeInfo'  => $this->resumeInfo,
                'acceptUrl'   => $this->acceptUrl,
                'rejectUrl'   => $this->rejectUrl,
            ]);

        if (!empty($this->application->resume_path) && Storage::disk('local')->exists($this->application->resume_path)) {
            $fullPath = Storage::disk('local')->path($this->application->resume_path);
            $options = [];
            if (!empty($this->resumeInfo['original_name'])) {
                $options['as'] = $this->resumeInfo['original_name'];
            }
            $mail->attach($fullPath, $options);
        }

        return $mail;
    }
}