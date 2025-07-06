import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient-services';
import { Observable } from 'rxjs';
import { DatePipe, NgIf, AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PatientForm } from '../patient-form/patient-form';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    MatTableModule,
    AsyncPipe,
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    PatientForm,
    MatDialogModule,
    
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss'
})
export class PatientList implements OnInit {
  search: string = '';
  patients$!: Observable<any[]>;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dob',
    'email',
    'phoneNumber',
    'address',
    'actions'
  ];

  onSearch(){
    this.patients$ = this.patientService.getPatients(this.search);
  }

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog 
  ) {}

  ngOnInit() {
    this.patients$ = this.patientService.getPatients();
  }

  clearSearch() { 
    this.search = '';
    this.onSearch();
  }

  openAddPatientDialog() {
    const dialogRef = this.dialog.open(PatientForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSearch();
      }
    });
  }

  editPatient(patient: any): void {
    this.dialog.open(PatientForm, {
      width: '500px',
      data: { id: patient._id }
    });
  }

  deletePatient(patient: any) {
    const id = patient._id;
    const fullName = `${patient.firstName} ${patient.lastName}`;
  
    if (!id) {
      console.error('Patient ID is missing:', patient);
      return;
    }
  
    if (confirm(`Are you sure you want to delete ${fullName}?`)) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.onSearch();
          console.log(`Deleted patient: ${fullName}`);
        },
        error: err => alert('Delete failed: ' + (err.error?.message || err.message))
      });
    }
  }

  onRowClick(patient: any): void {
    console.log('Clicked patient ID:', patient.id || patient._id || '[No ID found]');
    console.log('Patient row object:', patient);

  }
}