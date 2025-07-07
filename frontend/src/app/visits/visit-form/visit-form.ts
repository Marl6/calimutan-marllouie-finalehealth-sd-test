import { Component, OnInit, inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { VisitService } from '../../services/visit-services';
import { PatientService } from '../../services/patient-services';

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Visit {
  _id?: string;
  patientId: string;
  visitDate: Date;
  notes: string;
  visitType: 'Home' | 'Telehealth' | 'Clinic';
}

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './visit-form.html',
  styleUrl: './visit-form.scss'
})
export class VisitForm implements OnInit {
  fb = inject(FormBuilder);
  visitService = inject(VisitService);
  patientService = inject(PatientService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<VisitForm>, { optional: true });
  dialogData = inject<{ id: string }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  visitId?: string;
  isEdit = false;
  
  patients: Patient[] = [];
  filteredPatients!: Observable<Patient[]>;
  
  visitTypes = [
    { value: 'Home', label: 'Home' },
    { value: 'Telehealth', label: 'Telehealth' },
    { value: 'Clinic', label: 'Clinic' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientDisplay: ['', Validators.required], // For display in autocomplete
      visitDate: ['', Validators.required],
      notes: [''],
      visitType: ['', Validators.required]
    });

    this.loadPatients();
    this.setupPatientAutocomplete();

    // Check if editing existing visit
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadVisit(id);
      }
    });

    if (this.dialogData?.id) {
      this.loadVisit(this.dialogData.id);
    }
  }

  private loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (err) => console.error('Error loading patients:', err)
    });
  }

  private setupPatientAutocomplete(): void {
    this.filteredPatients = this.form.get('patientDisplay')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPatients(value || ''))
    );
  }

  private filterPatients(value: string): Patient[] {
    if (typeof value !== 'string') return this.patients;
    
    const filterValue = value.toLowerCase();
    return this.patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filterValue) ||
      patient.email.toLowerCase().includes(filterValue)
    );
  }

  displayPatientName(patient: Patient): string {
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  onPatientSelected(patient: Patient): void {
    if (patient && patient._id) {
      this.form.patchValue({
        patientId: patient._id,
        patientDisplay: `${patient.firstName} ${patient.lastName}`
      });
    }
  }

  private loadVisit(id: string): void {
    this.visitId = id;
    this.isEdit = true;
    this.visitService.getVisitById(id).subscribe({
      next: (visit) => {
        // Find the patient for display
        const patient = this.patients.find(p => p._id === visit.patientId);
        
        this.form.patchValue({
          patientId: visit.patientId,
          patientDisplay: patient ? `${patient.firstName} ${patient.lastName}` : '',
          visitDate: visit.visitDate,
          notes: visit.notes,
          visitType: visit.visitType
        });
      },
      error: (err) => console.error('Error loading visit:', err)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const visitData = {
      patientId: this.form.value.patientId,
      visitDate: this.form.value.visitDate,
      notes: this.form.value.notes,
      visitType: this.form.value.visitType
    };

    const action$ = this.isEdit && this.visitId
      ? this.visitService.updateVisit(this.visitId, visitData)
      : this.visitService.createVisit(visitData.patientId, visitData);

    action$.subscribe({
      next: () => {
        if (this.dialogRef) {
          alert(`${this.isEdit ? 'Visit updated successfully' : 'Visit created successfully'}`);
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/visits']);
        }
      },
      error: err => alert(`${this.isEdit ? 'Update' : 'Create'} failed: ${err.error?.message || err.message}`)
    });
  }
}