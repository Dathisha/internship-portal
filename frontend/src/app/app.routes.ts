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
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicyComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms').then((m) => m.TermsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];