import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-component',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {

}
