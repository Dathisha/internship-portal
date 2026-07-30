import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'internship-programs',
    loadComponent: () => import('./pages/internship-programs/internship-programs').then((m) => m.InternshipProgramsComponent),
  },
  {
    path: 'apply',
    loadComponent: () => import('./pages/apply-now/apply-now').then((m) => m.ApplyNowComponent),
  },
  {
    path: 'certificate-generator',
    loadComponent: () => import('./pages/certificate-generator/certificate-generator').then((m) => m.CertificateGeneratorComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-us/contact-us').then((m) => m.ContactUsComponent),
  },
  {
    path: 'admin/certificates',
    loadComponent: () => import('./pages/admin-certificate-generator/admin-certificate-generator').then((m) => m.AdminCertificateGeneratorComponent),
  },
  {
    path: 'verify-certificate/:id',
    loadComponent: () => import('./pages/verify-certificate/verify-certificate').then((m) => m.VerifyCertificateComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];