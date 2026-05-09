import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { CartStore } from '../../stores/cart-store/cart-store';
import { RouterLink } from '@angular/router'


@Component({
  selector: 'app-cart-dialog',
  imports: [RouterLink],
  templateUrl: './cart-dialog.html',
  styleUrl: './cart-dialog.css',
})
export class CartDialogComponent {
  cartStore = inject(CartStore);

  @Output() close = new EventEmitter()
  closeModal(){
    return this.close.emit()
  }
}
