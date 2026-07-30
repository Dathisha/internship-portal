<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Application Accepted — Intern 2 Expert</title>
<style>
  body{font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;background:#f3f6ff;color:#1f2937;margin:0;padding:0}
  .wrap{width:100%;max-width:640px;margin:0 auto}
  .card{background:#fff;border-radius:20px;box-shadow:0 24px 80px rgba(15,23,42,.12);overflow:hidden;margin:32px auto}
  .header{background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);padding:40px 32px;text-align:center}
  .header-icon{width:64px;height:64px;background:rgba(255,255,255,.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
  .header-icon svg{width:32px;height:32px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
  .header h1{margin:0;font-size:24px;color:#fff;letter-spacing:.02em}
  .header p{margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.85)}
  .body{padding:36px 32px}
  .greeting{font-size:18px;font-weight:600;color:#111827;margin-bottom:12px}
  .message{font-size:15px;line-height:1.8;color:#374151;margin-bottom:24px}
  .highlight-box{background:#f0fdf4;border-left:4px solid #16a34a;border-radius:8px;padding:20px 24px;margin-bottom:28px}
  .highlight-box p{margin:0;font-size:15px;line-height:1.7;color:#14532d}
  .next-steps{background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:28px}
  .next-steps h3{margin:0 0 12px;font-size:15px;color:#111827;font-weight:700}
  .next-steps ul{margin:0;padding-left:20px;color:#4b5563;font-size:14px;line-height:2}
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
      <div class="header-icon">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1>Congratulations!</h1>
      <p>Your internship application has been accepted</p>
    </div>
    <div class="body">
      <p class="greeting">Dear {{ $application->full_name }},</p>
      <p class="message">
        We are thrilled to inform you that your internship application to
        <strong>Crescent Technosoft — Intern 2 Expert</strong> has been
        <strong style="color:#16a34a">accepted</strong>.
      </p>

      <div class="highlight-box">
        <p>
          Congratulations! Your internship application has been accepted by Crescent Technosoft. We will contact you with the next steps.
        </p>
      </div>

      <div class="next-steps">
        <h3>What happens next?</h3>
        <ul>
          <li>Our HR team will reach out to you within 2–3 business days.</li>
          <li>You will receive your onboarding details via email.</li>
          <li>Please keep an eye on your inbox (and spam folder).</li>
        </ul>
      </div>

      <p class="message">
        We look forward to welcoming you to our internship program.
        If you have any questions in the meantime, feel free to reach out to us.
      </p>

      <div class="signature">
        Warm regards,<br>
        <strong>HR Team</strong><br>
        Crescent Technosoft | Intern 2 Expert<br>
        <a href="mailto:intern2expert.portal@gmail.com" style="color:#16a34a">intern2expert.portal@gmail.com</a>
      </div>
    </div>
    <div class="footer">
      <strong>Crescent Technosoft</strong> | Intern 2 Expert &mdash; intern2expert.crescenttechnosoft.com
    </div>
  </div>
</div>
</body>
</html>
