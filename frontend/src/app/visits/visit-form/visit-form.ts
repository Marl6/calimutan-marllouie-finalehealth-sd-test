import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, startWith, of } from 'rxjs';
import { VisitService } from '../../services/visit-services';
import { PatientService } from '../../services/patient-services';
import { AsyncPipe, CommonModule } from '@angular/common';
import { VisitType } from '../../enums/enums';

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

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'MMM d, yyyy, h : mm a',
  },
  display: {
    dateInput: 'MMM d, yyyy, h : mm a',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    AsyncPipe,
  ], providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  templateUrl: './visit-form.html',
  styleUrl: './visit-form.scss'
}
)

export class VisitForm implements OnInit {
  originalPatient!: Patient;
  visitService = inject(VisitService);
  patientService = inject(PatientService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<VisitForm>, { optional: true });

  dialogData = inject<{ id?: string; patient?: Patient }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  visitId?: string;
  isEdit = false;

  patients: Patient[] = [];
  filteredPatients: Observable<Patient[]> = of([]);
  VisitType = VisitType;

  visitTypes = [
    { value: VisitType.HOME, label: 'Home' },
    { value: VisitType.TELEHEALTH, label: 'Telehealth' },
    { value: VisitType.CLINIC, label: 'Clinic' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientDisplay: [''],
      visitType: ['', Validators.required],
      visitDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.setupPatientAutocomplete();

        if (this.dialogData?.patient) {
          this.originalPatient = this.dialogData.patient;
          this.form.patchValue({
            patientId: this.dialogData.patient._id,
            patientDisplay: this.displayPatientName(this.dialogData.patient)
          });
        }

        if (this.dialogData?.id) {
          this.loadVisit(this.dialogData.id);
        } else {
          this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) this.loadVisit(id);
          });
        }
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

public filterPatients(value: string | Patient): Patient[] {
  if (typeof value === 'object' && value !== null) {
    return this.patients; 
  }
  
  const filterValue = (value as string).toLowerCase();
  return this.patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filterValue) ||
    patient.email.toLowerCase().includes(filterValue)
  );
}

  displayPatientName(patient: Patient): string {
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  onPatientSelected(patient: Patient): void {
    this.form.patchValue({
      patientId: patient._id,
      patientDisplay: this.displayPatientName(patient)
    });
  }

  onAutocompleteClosed(): void {
  const patientDisplay = this.form.get('patientDisplay')?.value;

  const isValidPatient = typeof patientDisplay === 'object' && patientDisplay?._id;
  if (!isValidPatient && this.originalPatient) {
    this.form.patchValue({
      patientId: this.originalPatient._id,
      patientDisplay: this.displayPatientName(this.originalPatient)
    });
  }
}

  private loadVisit(id: string): void {
    this.visitId = id;
    this.isEdit = true;
    this.visitService.getVisitById(id).subscribe({
      next: (visit) => {
        const patient = this.patients.find(p => p._id === visit.patientId);
        if (patient) {
          this.originalPatient = patient;
        }
        this.form.patchValue({
          patientId: visit.patientId,
          patientDisplay: patient ? this.displayPatientName(patient) : '',
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
      visitDate: this.form.value.visitDate,
      notes: this.form.value.notes,
      visitType: this.form.value.visitType
    };

    const action$ = this.isEdit && this.visitId
      ? this.visitService.updateVisit(this.visitId, visitData)
      : this.visitService.createVisit(this.form.value.patientId, visitData);

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
