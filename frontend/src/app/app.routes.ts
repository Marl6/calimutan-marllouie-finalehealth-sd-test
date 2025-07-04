import { Routes } from '@angular/router';
import { PatientList } from './patients/patient-list/patient-list';
import { PatientForm } from './patients/patient-form/patient-form';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patientslist', component: PatientList },
  { path: 'patients/add', component: PatientForm },
  { path: 'patients/edit/:id', component: PatientForm },
  
];
