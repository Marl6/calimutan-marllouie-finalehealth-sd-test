import { Component, OnInit, inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient-services';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss'
})
export class PatientForm implements OnInit {
  fb = inject(FormBuilder);
  patientService = inject(PatientService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<PatientForm>, { optional: true });
  dialogData = inject<{ id: string }>(MAT_DIALOG_DATA, { optional: true });

  form!: FormGroup;
  patientId?: string;
  isEdit = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPatient(id);
      }
    });

    if (this.dialogData?.id) {
      this.loadPatient(this.dialogData.id);
    }
  }

  private loadPatient(id: string) {
    this.patientId = id;
    this.isEdit = true;
    this.patientService.getPatient(id).subscribe(patient => {
      const formattedPatient = {
        ...patient,
        dob: patient.dob ? patient.dob.slice(0, 10) : ''
      };
      this.form.patchValue(formattedPatient);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const action$ = this.isEdit && this.patientId
      ? this.patientService.updatePatient(this.patientId, this.form.value)
      : this.patientService.createPatient(this.form.value);

    action$.subscribe({
      next: () => {
        if (this.dialogRef) {
          alert(`${this.isEdit ? 'Patient updated successfully' : 'Patient created successfully'}`);
          this.dialogRef.close(true);
     
        } else { 
          this.router.navigate(['/patients']);
        }
      },
      error: err => alert(`${this.isEdit ? 'Update' : 'Create'} failed: ${err.error?.message || err.message}`)
    });
  }
}
