import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.scss']
})
export class PatientList {
}
