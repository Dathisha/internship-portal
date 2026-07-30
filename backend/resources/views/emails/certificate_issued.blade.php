<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Certificate is Ready — Intern 2 Expert</title>
<style>
  body{font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;background:#f3f6ff;color:#1f2937;margin:0;padding:0}
  .wrap{width:100%;max-width:640px;margin:0 auto}
  .card{background:#fff;border-radius:20px;box-shadow:0 24px 80px rgba(15,23,42,.12);overflow:hidden;margin:32px auto}
  .header{background:linear-gradient(135deg,#5b2c83 0%,#7c3aed 100%);padding:40px 32px;text-align:center}
  .header-icon{width:72px;height:72px;background:rgba(255,255,255,.18);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
  .header-icon svg{width:38px;height:38px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .header h1{margin:0;font-size:26px;color:#fff;letter-spacing:.02em}
  .header p{margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.85)}
  .body{padding:36px 32px}
  .greeting{font-size:18px;font-weight:600;color:#111827;margin-bottom:12px}
  .message{font-size:15px;line-height:1.8;color:#374151;margin-bottom:24px}
  /* Certificate ID box */
  .cert-id-box{background:linear-gradient(135deg,#f5f0ff,#ede9fe);border:2px solid #c4b5fd;border-radius:14px;padding:28px 24px;margin-bottom:28px;text-align:center}
  .cert-id-label{font-size:12px;font-weight:700;letter-spacing:.1em;color:#7c3aed;text-transform:uppercase;margin-bottom:8px}
  .cert-id-value{font-size:22px;font-weight:800;color:#4c1d95;letter-spacing:.06em;font-family:monospace;word-break:break-all}
  /* CTA button */
  .cta-wrap{text-align:center;margin:28px 0}
  .cta-btn{display:inline-block;background:linear-gradient(135deg,#5b2c83,#7c3aed);color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;letter-spacing:.03em;box-shadow:0 8px 24px rgba(91,44,131,.35)}
  .steps{background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:28px}
  .steps h3{margin:0 0 14px;font-size:15px;color:#111827;font-weight:700}
  .step{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
  .step-num{width:26px;height:26px;background:#7c3aed;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:1px}
  .step-text{font-size:14px;color:#374151;line-height:1.6}
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
        <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
      </div>
      <h1>Your Certificate is Ready!</h1>
      <p>Intern 2 Expert — Crescent Technosoft</p>
    </div>

    <div class="body">
      <p class="greeting">Dear {{ $studentName }},</p>
      <p class="message">
        Congratulations on successfully completing your internship at
        <strong>Crescent Technosoft — Intern 2 Expert</strong>!
        Your internship certificate has been issued and is now ready to download.
      </p>

      <div class="cert-id-box">
        <div class="cert-id-label">Your Certificate ID</div>
        <div class="cert-id-value">{{ $certificate->certificate_id }}</div>
      </div>

      <div class="cta-wrap">
        <a href="{{ $generatorUrl }}" class="cta-btn">Generate &amp; Download Certificate</a>
      </div>

      <div class="steps">
        <h3>How to get your certificate:</h3>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Click the button above or visit our <strong>AI Certificate Generator</strong> page.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Enter your <strong>Certificate ID</strong> shown above in the search box.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Preview, download as PDF, or print your professional certificate.</div>
        </div>
      </div>

      <p class="message">
        We are proud of your achievements and wish you every success in your future endeavours.
        Keep this Certificate ID safe — you will need it to access and verify your certificate.
      </p>

      <div class="signature">
        Warm regards,<br>
        <strong>HR Team</strong><br>
        Crescent Technosoft | Intern 2 Expert<br>
        <a href="mailto:intern2expert.portal@gmail.com" style="color:#7c3aed">intern2expert.portal@gmail.com</a>
      </div>
    </div>

    <div class="footer">
      <strong>Crescent Technosoft</strong> | Intern 2 Expert &mdash; intern2expert.crescenttechnosoft.com
    </div>
  </div>
</div>
</body>
</html>
