import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', loadComponent: () => import('./patients/patient-list/patient-list').then(m => m.PatientList) },
  { path: 'patients/add', loadComponent: () => import('./patients/patient-form/patient-form').then(m => m.PatientForm) },
  { path: 'patients/edit/:id', loadComponent: () => import('./patients/patient-form/patient-form').then(m => m.PatientForm) },
  { path: 'patients/:id/visits', loadComponent: () => import('./visits/visit-list/visit-list').then(m => m.VisitList) },
  { path: 'patients/:id/visits/add', loadComponent: () => import('./visits/visit-form/visit-form').then(m => m.VisitForm) },
  { path: 'patients/:id/visits/edit/:visitId', loadComponent: () => import('./visits/visit-form/visit-form').then(m => m.VisitForm) },
  { path: 'visits', loadComponent: () => import('./visits/visit-list/visit-list').then(m => m.VisitList) },

  { path: 'summary', loadComponent: () => import('./summary/summary').then(m => m.Summary) }
];