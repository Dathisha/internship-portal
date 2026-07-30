<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MonthlyReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $monthName;
    public int $year;
    public int $totalCount;
    public string $pdfRawData;

    public function __construct(string $monthName, int $year, int $totalCount, string $pdfRawData)
    {
        $this->monthName  = $monthName;
        $this->year       = $year;
        $this->totalCount = $totalCount;
        $this->pdfRawData = $pdfRawData;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Monthly Internship Registration Report — {$this->monthName} {$this->year}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;'>
                    <h2 style='color: #5b2c83;'>Crescent Technosoft — Intern2Expert</h2>
                    <h3 style='color: #0f172a;'>Monthly Internship Registration Report ({$this->monthName} {$this->year})</h3>
                    <p>Dear Team,</p>
                    <p>Please find attached the official Monthly Internship Registration Report for <strong>{$this->monthName} {$this->year}</strong>.</p>
                    <div style='background: #f8fafc; border-left: 4px solid #5b2c83; padding: 12px 16px; margin: 16px 0;'>
                        <strong>Total Registered Students:</strong> {$this->totalCount}
                    </div>
                    <p>This report includes complete student details registered during this month.</p>
                    <br>
                    <p style='font-size: 13px; color: #64748b;'>Best regards,<br><strong>Intern2Expert Automated System</strong><br>Crescent Technosoft</p>
                </div>
            ",
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdfRawData, "Monthly_Internship_Registration_Report_{$this->monthName}_{$this->year}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
