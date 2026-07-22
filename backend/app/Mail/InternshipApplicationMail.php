<?php

namespace App\Mail;

use App\Models\InternshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InternshipApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public InternshipApplication $application;
    public array $resumeInfo;

    public function __construct(InternshipApplication $application, array $resumeInfo = [])
    {
        $this->application = $application;
        $this->resumeInfo = $resumeInfo;
    }

    public function build()
    {
        return $this
            ->subject('New Internship Application - Intern 2 Expert')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.internship_application')
            ->with([
                'application' => $this->application,
                'resumeInfo' => $this->resumeInfo,
            ]);
    }
}
