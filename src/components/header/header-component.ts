import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router"

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, RouterLinkActive ],
  standalone:true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {

}
