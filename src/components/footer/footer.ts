import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router"

@Component({
  selector: 'app-footer-component',
  imports: [RouterLink, RouterLinkActive ],
  standalone:true,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {

}
