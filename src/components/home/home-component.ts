import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-component',
  standalone: true,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
