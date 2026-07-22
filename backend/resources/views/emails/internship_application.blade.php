<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Internship Application</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f6ff;
            color: #1f2937;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%);
            color: #ffffff;
            padding: 32px 28px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 0.02em;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 28px;
        }
        .section-title {
            margin: 0 0 16px;
            font-size: 18px;
            letter-spacing: 0.02em;
            color: #111827;
        }
        .details {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .details td {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .details td.label {
            width: 180px;
            font-weight: 700;
            color: #111827;
        }
        .details td.value {
            color: #374151;
        }
        .footer {
            background: #f8fafc;
            padding: 20px 28px;
            color: #6b7280;
            font-size: 13px;
        }
        .footer strong {
            color: #111827;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Crescent Technosoft — Intern 2 Expert</h1>
            <p>New internship application received</p>
        </div>
        <div class="content">
            <h2 class="section-title">Applicant Information</h2>
            <table class="details">
                <tr>
                    <td class="label">Student Name</td>
                    <td class="value">{{ $application->full_name }}</td>
                </tr>
                <tr>
                    <td class="label">Email Address</td>
                    <td class="value">{{ $application->email }}</td>
                </tr>
                <tr>
                    <td class="label">Phone Number</td>
                    <td class="value">{{ $application->mobile }}</td>
                </tr>
                <tr>
                    <td class="label">College Name</td>
                    <td class="value">{{ $application->college_name }}</td>
                </tr>
                <tr>
                    <td class="label">Department</td>
                    <td class="value">{{ $application->department }}</td>
                </tr>
                <tr>
                    <td class="label">Internship Domain</td>
                    <td class="value">{{ $application->internship_domain }}</td>
                </tr>
                <tr>
                    <td class="label">Application ID</td>
                    <td class="value">{{ $application->application_id }}</td>
                </tr>
                <tr>
                    <td class="label">Applied Date & Time</td>
                    <td class="value">{{ $application->created_at->format('F j, Y \a\t g:i A') }}</td>
                </tr>
                <tr>
                    <td class="label">Resume</td>
                    <td class="value">
                        {{ $resumeInfo['original_name'] ?? 'Uploaded resume' }}
                        @if(!empty($resumeInfo['size_kb']))
                            ({{ $resumeInfo['size_kb'] }} KB)
                        @endif
                    </td>
                </tr>
            </table>
            <div>
                <p style="margin:0; color:#4b5563; line-height:1.7;">
                    This email was generated automatically when a new internship application was submitted through the Intern 2 Expert portal.
                </p>
            </div>
        </div>
        <div class="footer">
            <strong>Crescent Technosoft</strong> | Intern 2 Expert
        </div>
    </div>
</body>
</html>
