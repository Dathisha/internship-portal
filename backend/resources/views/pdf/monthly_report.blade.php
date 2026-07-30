<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Monthly Internship Registration Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 15mm 12mm 20mm 12mm;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1e293b;
    font-size: 10px;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }

  /* Header Section */
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }

  .header-table td {
    vertical-align: middle;
  }

  .logo-left {
    width: 140px;
    text-align: left;
  }

  .logo-right {
    width: 140px;
    text-align: right;
  }

  .header-center {
    text-align: center;
  }

  .report-title {
    font-size: 18px;
    font-weight: 800;
    color: #6C4CFD;
    margin: 0;
    letter-spacing: -0.3px;
    text-transform: uppercase;
  }

  .report-subtitle {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    margin-top: 3px;
  }

  .top-divider {
    height: 3px;
    background: linear-gradient(90deg, #6C4CFD 0%, #8B5CF6 100%);
    border-radius: 2px;
    margin-bottom: 16px;
  }

  /* Summary Section */
  .summary-container {
    width: 100%;
    border-collapse: collapse;
    background-color: #F8F7FF;
    border: 1px solid #E6DFFE;
    border-left: 5px solid #6C4CFD;
    border-radius: 6px;
    margin-bottom: 18px;
  }

  .summary-container td {
    padding: 10px 16px;
    vertical-align: middle;
  }

  .summary-card-title {
    font-size: 9px;
    font-weight: 700;
    color: #6C4CFD;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .summary-card-value {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
  }

  .summary-divider {
    border-right: 1px solid #E6DFFE;
  }

  /* Data Table */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .data-table thead {
    display: table-header-group;
  }

  .data-table tr {
    page-break-inside: avoid;
  }

  .data-table th {
    background-color: #6C4CFD;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    text-align: left;
    padding: 8px 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border: 1px solid #6C4CFD;
  }

  .data-table td {
    padding: 7px 6px;
    border: 1px solid #E6DFFE;
    font-size: 9.5px;
    vertical-align: middle;
    word-wrap: break-word;
  }

  .data-table tbody tr:nth-child(even) td {
    background-color: #F7F5FF;
  }

  .sno {
    text-align: center;
    font-weight: 600;
    color: #475569;
  }

  .app-id {
    font-family: 'Courier', monospace;
    font-weight: 700;
    color: #6C4CFD;
  }

  .student-name {
    font-weight: 700;
    color: #0f172a;
  }

  .email-cell {
    color: #2563eb;
  }

  .domain-tag {
    display: inline-block;
    background-color: #EDE9FE;
    color: #5B21B6;
    padding: 2px 5px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8.5px;
  }

  .empty-state {
    text-align: center;
    padding: 30px;
    color: #64748b;
    font-size: 11px;
    font-style: italic;
    background-color: #F8F7FF;
    border: 1px dashed #D8CEFF;
    border-radius: 6px;
  }

  /* Inline Corporate Logo SVGs */
  .logo-text-crescent {
    font-size: 13px;
    font-weight: 800;
    color: #6C4CFD;
    line-height: 1.1;
  }
  .logo-sub-crescent {
    font-size: 8px;
    color: #64748B;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .badge-i2e {
    background-color: #6C4CFD;
    color: #ffffff;
    font-weight: 800;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 6px;
    display: inline-block;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

  <!-- ══════════════════════════ HEADER ══════════════════════════ -->
  <table class="header-table">
    <tr>
      <!-- Left: Crescent Technosoft Logo -->
      <td class="logo-left">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#6C4CFD"/>
                <path d="M12 20C12 15.5817 15.5817 12 20 12C21.6569 12 23.1906 12.5036 24.4604 13.3643C22.6806 14.2882 21.4604 16.1472 21.4604 18.2857C21.4604 21.1965 23.8039 23.551 26.6978 23.551C27.5684 23.551 28.3888 23.3364 29.1121 22.9554C28.1633 26.5057 24.9351 29.1429 21.0935 29.1429C16.0712 29.1429 12 25.0494 12 20Z" fill="white"/>
              </svg>
            </td>
            <td style="padding-left: 8px;">
              <div class="logo-text-crescent">CRESCENT</div>
              <div class="logo-sub-crescent">TECHNOSOFT</div>
            </td>
          </tr>
        </table>
      </td>

      <!-- Center: Title & Period -->
      <td class="header-center">
        <h1 class="report-title">Monthly Internship Registration Report</h1>
        <div class="report-subtitle">{{ $monthName }} {{ $year }}</div>
      </td>

      <!-- Right: Intern2Expert Logo -->
      <td class="logo-right">
        <div class="badge-i2e">INTERN2EXPERT</div>
        <div style="font-size: 8px; color: #64748b; font-weight: 600; margin-top: 3px;">Official Portal</div>
      </td>
    </tr>
  </table>

  <!-- Violet Top Accent Line -->
  <div class="top-divider"></div>

  <!-- ══════════════════════════ SUMMARY BOX ══════════════════════════ -->
  <table class="summary-container">
    <tr>
      <td class="summary-divider" style="width: 50%;">
        <div class="summary-card-title">Total Applications Received</div>
        <div class="summary-card-value">{{ count($applications) }} Application(s)</div>
      </td>
      <td style="width: 50%;">
        <div class="summary-card-title">Report Generated Date</div>
        <div class="summary-card-value">{{ now()->format('F j, Y') }}</div>
      </td>
    </tr>
  </table>

  <!-- ══════════════════════════ DATA TABLE ══════════════════════════ -->
  @if(count($applications) > 0)
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">S.No</th>
        <th style="width: 15%;">Application ID</th>
        <th style="width: 16%;">Student Name</th>
        <th style="width: 18%;">Email Address</th>
        <th style="width: 12%;">Mobile Number</th>
        <th style="width: 14%;">College Name</th>
        <th style="width: 11%;">Internship Program</th>
        <th style="width: 9%;">Registration Date</th>
      </tr>
    </thead>
    <tbody>
      @foreach($applications as $index => $app)
      <tr>
        <td class="sno">{{ $index + 1 }}</td>
        <td class="app-id">{{ $app->application_id }}</td>
        <td class="student-name">{{ $app->full_name }}</td>
        <td class="email-cell">{{ $app->email }}</td>
        <td>{{ $app->mobile }}</td>
        <td>{{ $app->college_name }}</td>
        <td><span class="domain-tag">{{ $app->internship_domain }}</span></td>
        <td>{{ $app->created_at->format('M d, Y') }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
  @else
  <div class="empty-state">
    No internship applications were registered during {{ $monthName }} {{ $year }}.
  </div>
  @endif

  <!-- ══════════════════════════ DOMPDF FOOTER SCRIPT ══════════════════════════ -->
  <script type="text/php">
    if (isset($pdf)) {
        $font = $fontMetrics->get_font("Helvetica", "normal");
        $size = 8.5;
        $color = array(0.4, 0.4, 0.45);
        
        // Dynamic Page Number: "Page X of Y"
        $pdf->page_text(485, 810, "Page {PAGE_NUM} of {PAGE_COUNT}", $font, $size, $color);
        
        // Footer Left Text: "Generated by Intern2Expert | Crescent Technosoft"
        $pdf->page_text(34, 810, "Generated by Intern2Expert | Crescent Technosoft", $font, $size, $color);
    }
  </script>

</body>
</html>
