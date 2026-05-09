import { Component,ChangeDetectionStrategy, signal } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CartDialogComponent} from '../../shared/cart-dialog/cart-dialog'

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, RouterLinkActive, CartDialogComponent],
  standalone:true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isOpen = signal(false);

  openModalCart(){
    this.isOpen.set(true)
  }
  closeModalCart(){
    this.isOpen.set(false)
  }
}
