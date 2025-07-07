import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitService } from '../../app/services/visit-services';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIcon],
  templateUrl: './summary.html',
  styleUrl: './summary.scss'
})
export class Summary implements OnInit {
  dialogData = inject<{ patient: any }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<Summary>);
  private visitService = inject(VisitService);

  patient = this.dialogData.patient;
  visits: any[] = [];

  displayedColumns: string[] = ['visitDate', 'visitType', 'notes'];

  ngOnInit(): void {
    if (this.patient?._id) {
      this.loadVisits(this.patient._id);
    }
  }

  private loadVisits(patientId: string): void {
    this.visitService.getVisitsByPatientId(patientId).subscribe({
      next: (data) => this.visits = data,
      error: (err) => console.error('Failed to load visits', err)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
