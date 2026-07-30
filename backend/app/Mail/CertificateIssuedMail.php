<?php

namespace App\Mail;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CertificateIssuedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Certificate $certificate;
    public string $studentName;

    public function __construct(Certificate $certificate, string $studentName)
    {
        $this->certificate = $certificate;
        $this->studentName = $studentName;
    }

    public function build()
    {
        return $this
            ->subject('Your Internship Certificate is Ready — Intern 2 Expert')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.certificate_issued')
            ->with([
                'certificate'  => $this->certificate,
                'studentName'  => $this->studentName,
                'generatorUrl' => config('app.url') . '/certificate-generator',
            ]);
    }
}