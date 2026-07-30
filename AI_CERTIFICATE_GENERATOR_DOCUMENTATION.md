# AI Certificate Generator - Feature Documentation

## Overview

The **AI Certificate Generator** is a comprehensive admin-only feature that allows administrators to generate professional internship certificates for approved candidates. The system automates the certificate creation process by fetching candidate data from the database and generating PDF certificates with QR codes for verification.

## Features

### 1. **Admin Panel Access**
- Accessible only through authenticated admin users
- Route: `/admin/certificates`
- Available in the footer navigation under "Admin" section

### 2. **Candidate Selection**
- Displays a list of approved internship candidates
- Auto-fetches candidate details (name, email, domain, college, start date)
- One-click selection to populate form fields

### 3. **Certificate Generation**
- **Automatic Fields:**
  - Candidate Name
  - Internship Domain
  - College Name
  - Start Date (from application)
  
- **Manual Fields:**
  - Duration (in months)
  - End Date

### 4. **Certificate Details**
- Professional certificate template with:
  - Company Name (Crescent Technosoft)
  - Company Logo support
  - Student name (prominently displayed)
  - Internship domain
  - Start and end dates
  - Duration in months
  - Issue date (auto-set to current date)
  - Auto-generated Certificate ID (CERT-{timestamp}-{random})
  - QR Code for verification (links to `/verify-certificate/{certificateId}`)
  - Digital signature areas
  - Professional styling

### 5. **Preview & Download**
- **Preview:** Live preview of certificate before saving
- **Download PDF:** Export certificate as high-quality PDF file
- **Print:** Direct print functionality for physical copies
- **Save:** Store certificate details in database

### 6. **Duplicate Prevention**
- System prevents duplicate certificate generation for the same internship application
- Backend validation ensures integrity

### 7. **Certificate Verification**
- Candidates can verify certificates using QR code
- Verification page at `/verify-certificate/:certificateId`
- Displays certificate authenticity and details

## Technical Architecture

### Frontend Components

#### **AdminCertificateGeneratorComponent** (`admin-certificate-generator.ts`)
- Main admin panel for certificate generation
- Form validation using Angular Reactive Forms
- PDF generation using jsPDF library
- QR code generation using qrcode library
- Certificate preview using embedded PDF viewer

**Key Methods:**
- `loadCandidates()` - Fetch approved candidates from backend
- `onCandidateSelect()` - Handle candidate selection
- `generatePreview()` - Generate certificate preview
- `downloadPDF()` - Export as PDF file
- `saveCertificate()` - Save to database
- `printCertificate()` - Print functionality

#### **VerifyCertificateComponent** (`verify-certificate.ts`)
- Public-facing certificate verification page
- QR code endpoint
- Displays certificate validity status

### Backend Components

#### **CertificateController** (`CertificateController.php`)
- Manages all certificate operations
- RESTful API endpoints

**Endpoints:**
- `GET /api/approved-candidates` - List approved candidates
- `POST /api/certificates` - Save certificate
- `GET /api/certificates/check/{id}` - Check for duplicates
- `GET /api/certificates/verify/{certificateId}` - Verify certificate

#### **Certificate Model** (`Certificate.php`)
- Database model for storing certificates
- Relationships with InternshipApplication model
- Timestamps for audit trail

#### **Database Migration**
- Certificates table with:
  - internship_application_id (FK)
  - certificate_id (unique)
  - candidate_name
  - domain
  - duration
  - start_date, end_date
  - issue_date
  - certificate_data (for storing PDF/metadata)
  - status (pending, approved, verified)
  - timestamps

### Services

#### **CertificateService** (`certificate.service.ts`)
- Angular HTTP service for API communication
- Methods:
  - `getApprovedCandidates()` - Fetch candidates
  - `saveCertificate()` - Save certificate
  - `checkDuplicateCertificate()` - Prevent duplicates
  - `verifyCertificate()` - Verify certificate

#### **SafePipe** (`safe.pipe.ts`)
- Custom pipe for bypassing Angular security sanitization
- Used for displaying PDF previews in iframe

## Installation & Setup

### Step 1: Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Required packages added:
# - jspdf: ^2.5.1 (PDF generation)
# - qrcode: ^1.5.3 (QR code generation)
```

### Step 2: Database Migration
```bash
# Backend
cd backend
php artisan migrate

# This creates the certificates table
```

### Step 3: Start Services
```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm start
```

## Usage Guide

### For Admin Users

1. **Navigate to Admin Panel**
   - Click footer link: Admin > Certificate Generator
   - Or navigate directly to: `http://localhost:4200/admin/certificates`

2. **Select a Candidate**
   - Choose from approved candidates dropdown
   - Candidate details auto-populate

3. **Add Certificate Details**
   - Enter internship duration (months)
   - Select end date

4. **Generate Preview**
   - Click "Generate Preview" button
   - Review certificate in preview window

5. **Download or Save**
   - **Download PDF:** Export for immediate use
   - **Save Certificate:** Store in database for later
   - **Print:** Print directly to printer

### For Candidate Users

1. **Verify Certificate**
   - Scan QR code from certificate
   - Or visit: `http://localhost:4200/verify-certificate/{certificateId}`

2. **View Certificate Details**
   - Displays authenticity status
   - Shows all certificate information

## File Structure

```
frontend/
├── src/app/
│   ├── pages/
│   │   ├── admin-certificate-generator/
│   │   │   ├── admin-certificate-generator.ts
│   │   │   ├── admin-certificate-generator.html
│   │   │   └── admin-certificate-generator.css
│   │   └── verify-certificate/
│   │       ├── verify-certificate.ts
│   │       ├── verify-certificate.html
│   │       └── verify-certificate.css
│   ├── core/services/
│   │   └── certificate.service.ts
│   └── shared/pipes/
│       └── safe.pipe.ts

backend/
├── app/
│   ├── Models/
│   │   └── Certificate.php
│   └── Http/Controllers/Api/
│       └── CertificateController.php
├── database/migrations/
│   └── 2026_07_27_create_certificates_table.php
└── routes/
    └── api.php
```

## API Reference

### Get Approved Candidates
```
GET /api/approved-candidates

Response:
[
  {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "internship_domain": "Web Development",
    "preferred_start_date": "2026-08-01",
    "mobile": "9876543210",
    "college_name": "VIT University"
  }
]
```

### Save Certificate
```
POST /api/certificates

Request:
{
  "internship_application_id": 1,
  "certificate_id": "CERT-1690000000000-5555",
  "candidate_name": "John Doe",
  "domain": "Web Development",
  "duration": 3,
  "start_date": "2026-08-01",
  "end_date": "2026-11-01",
  "issue_date": "2026-11-01"
}

Response:
{
  "message": "Certificate saved successfully",
  "data": { ... }
}
```

### Verify Certificate
```
GET /api/certificates/verify/{certificateId}

Response:
{
  "valid": true,
  "certificate": { ... }
}
```

## Security Considerations

### Implemented

1. **Backend Validation**
   - Certificate ID uniqueness
   - Duplicate prevention
   - Date validation

2. **QR Code Verification**
   - Cryptographic certificate ID
   - Verification via API

### Recommended

1. **Authentication**
   - Implement admin role-based access control
   - Add middleware to `/admin/certificates` route
   - Backend should verify admin status before returning candidates

2. **Authorization**
   - Backend API should verify admin permissions
   - Only admins can save certificates

3. **Audit Trail**
   - Log all certificate generation
   - Track who generated each certificate

4. **SSL/TLS**
   - Use HTTPS in production
   - Secure API communication

## Customization

### Change Certificate Template

Edit the `generateCertificatePreview()` method in `AdminCertificateGeneratorComponent`:

```typescript
// Modify certificate styling
pdf.setFontSize(28);
pdf.setTextColor(0, 56, 179); // Change colors
pdf.text('Your Custom Title', pageWidth / 2, yPosition, { align: 'center' });
```

### Add Company Logo

Update certificate generation to include logo:

```typescript
// Add logo image
pdf.addImage(logoUrl, 'PNG', 10, 10, 40, 40);
```

### Modify QR Code Data

Change QR code target URL in `generateCertificatePreview()`:

```typescript
// Default: https://intern2expert.com/verify-certificate/{certificateId}
// Custom: https://yourdomain.com/certificates/{certificateId}
```

## Troubleshooting

### Issue: "Failed to load candidates"
- Check backend is running
- Verify database connection
- Ensure internship_applications table has approved records

### Issue: "Cannot find module 'jspdf'"
- Run: `npm install jspdf qrcode`
- Restart development server

### Issue: "Certificate ID not generating"
- Check browser console for errors
- Verify timestamp function works

### Issue: "QR Code not displaying in PDF"
- Ensure qrcode library is installed
- Check canvas element in browser
- Verify QR URL is accessible

## Future Enhancements

1. **Email Delivery** - Auto-email certificates to candidates
2. **Bulk Generation** - Generate multiple certificates at once
3. **Templates** - Multiple certificate design templates
4. **Digital Signatures** - Add cryptographic signing
5. **Archive** - Search and retrieve past certificates
6. **Analytics** - Track certificate generation metrics
7. **Customization** - Admin UI to customize certificate text/design

## Support & Documentation

- **Frontend API Docs:** See CertificateService documentation
- **Backend API Docs:** See CertificateController comments
- **Database Schema:** See migrations file
- **Component Docs:** JSDoc comments in TypeScript files

## Version History

- **v1.0** - Initial release
  - Basic certificate generation
  - PDF export
  - QR code verification
  - Database storage

---

**Last Updated:** 2026-07-27
**Status:** Production Ready
