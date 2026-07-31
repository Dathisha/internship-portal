<?php

namespace App\Console\Commands;

use App\Mail\MonthlyReportMail;
use App\Models\InternshipApplication;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMonthlyCompanyReportCommand extends Command
{
    protected $signature = 'reports:send-monthly {--month= : Month number (1-12)} {--year= : Year (4 digits)} {--test : Run in test mode using all MySQL database records}';

    protected $description = 'Generate and send monthly internship registration PDF report to company official email';

    public function handle()
    {
        $targetDate = now();
        $isTestMode = (bool) $this->option('test');

        $month = $this->option('month') ? (int) $this->option('month') : $targetDate->month;
        $year  = $this->option('year') ? (int) $this->option('year') : $targetDate->year;

        $monthName = Carbon::createFromDate($year, $month, 1)->format('F');

        if ($isTestMode) {
            $this->info("TEST MODE ACTIVE: Generating monthly report with ALL applications currently in MySQL database...");
            $applications = InternshipApplication::orderBy('created_at', 'asc')
                ->orderBy('application_id', 'asc')
                ->get();
        } else {
            $this->info("Generating monthly report for {$monthName} {$year}...");
            $applications = InternshipApplication::whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->orderBy('created_at', 'asc')
                ->orderBy('application_id', 'asc')
                ->get();
        }

        $html = view('pdf.monthly_report', [
            'applications' => $applications,
            'monthName'    => $monthName,
            'year'         => $year,
        ])->render();

        $pdfOutput = '';

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdfOutput = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)
                ->setPaper('a4', 'portrait')
                ->setOption([
                    'isRemoteEnabled' => true,
                    'isPhpEnabled'    => true,
                    'chroot'          => [public_path(), base_path()],
                ])
                ->output();
        } elseif (class_exists(\Dompdf\Dompdf::class)) {
            $options = new \Dompdf\Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isPhpEnabled', true);
            $dompdf = new \Dompdf\Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            $pdfOutput = $dompdf->output();
        } else {
            $pdfOutput = $this->generateSimplePdfFallback($html, $monthName, $year, count($applications));
        }

        $recipient = config('mail.to') ?: 'intern2expert.portal@gmail.com';

        try {
            Mail::to($recipient)->send(new MonthlyReportMail($monthName, $year, count($applications), $pdfOutput));

            $modeText = $isTestMode ? "TEST MODE" : "AUTOMATIC MONTHLY";
            $this->info("{$modeText} report email successfully sent to {$recipient} (" . count($applications) . " total applications included).");

            Log::info("Monthly report sent to {$recipient}", [
                'mode'  => $isTestMode ? 'test' : 'scheduled',
                'month' => $monthName,
                'year'  => $year,
                'total' => count($applications),
            ]);

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to send monthly report email: " . $e->getMessage());
            Log::error("Failed to send monthly report email", ['error' => $e->getMessage()]);

            return Command::FAILURE;
        }
    }

    private function generateSimplePdfFallback(string $html, string $monthName, int $year, int $count): string
    {
        $pdfText = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 200 >>\nstream\nBT\n/F1 16 Tf\n50 750 Td\n(Crescent Technosoft - Monthly Internship Registration Report) Tj\n0 -20 Td\n/F1 12 Tf\n(Period: {$monthName} {$year} - Total Students: {$count}) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000247 00000 n \n0000000490 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n561\n%%EOF";
        return $pdfText;
    }
}
