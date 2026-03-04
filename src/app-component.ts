import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from "./components/header/header-component";
import { FooterComponent } from './components/footer/footer';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
  <div class="app-layout">
    <app-header-component></app-header-component>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer-component></app-footer-component>
  </div>
  `
})
export class AppComponent {}