import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './shared/dashboard/dashboard';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'frontend';
}
