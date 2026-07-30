<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Application Update — Intern 2 Expert</title>
<style>
  body{font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;background:#f3f6ff;color:#1f2937;margin:0;padding:0}
  .wrap{width:100%;max-width:640px;margin:0 auto}
  .card{background:#fff;border-radius:20px;box-shadow:0 24px 80px rgba(15,23,42,.12);overflow:hidden;margin:32px auto}
  .header{background:linear-gradient(135deg,#475569 0%,#334155 100%);padding:40px 32px;text-align:center}
  .header h1{margin:0;font-size:24px;color:#fff;letter-spacing:.02em}
  .header p{margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.85)}
  .body{padding:36px 32px}
  .greeting{font-size:18px;font-weight:600;color:#111827;margin-bottom:12px}
  .message{font-size:15px;line-height:1.8;color:#374151;margin-bottom:24px}
  .info-box{background:#f8fafc;border-left:4px solid #64748b;border-radius:8px;padding:20px 24px;margin-bottom:28px}
  .info-box p{margin:0;font-size:15px;line-height:1.7;color:#334155}
  .signature{font-size:14px;color:#4b5563;line-height:1.7}
  .signature strong{color:#111827}
  .footer{background:#f8fafc;padding:20px 32px;text-align:center;font-size:13px;color:#6b7280}
  .footer strong{color:#111827}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <h1>Application Update</h1>
      <p>Intern 2 Expert — Crescent Technosoft</p>
    </div>
    <div class="body">
      <p class="greeting">Dear {{ $application->full_name }},</p>
      <p class="message">
        Thank you for your interest in the internship program at
        <strong>Crescent Technosoft — Intern 2 Expert</strong> and for taking the time to apply.
      </p>
      <div class="info-box">
        <p>
          Thank you for applying to Crescent Technosoft. We appreciate your interest. Unfortunately, your application was not selected at this time.
        </p>
      </div>
      <p class="message">
        We encourage you to continue developing your skills and to apply again in future
        recruitment cycles. We wish you all the very best in your career journey.
      </p>
      <div class="signature">
        Sincerely,<br>
        <strong>HR Team</strong><br>
        Crescent Technosoft | Intern 2 Expert<br>
        <a href="mailto:intern2expert.portal@gmail.com" style="color:#475569">intern2expert.portal@gmail.com</a>
      </div>
    </div>
    <div class="footer">
      <strong>Crescent Technosoft</strong> | Intern 2 Expert &mdash; intern2expert.crescenttechnosoft.com
    </div>
  </div>
</div>
</body>
</html>
