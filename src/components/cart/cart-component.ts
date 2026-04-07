import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartStore } from '../../stores/cart-store/cart-store';

@Component({
  selector: 'app-cart-component',
  imports: [RouterLink],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css',
})
export class CartComponent {
  readonly cartStore = inject(CartStore);
  readonly cartArr= this.cartStore.items
  readonly clearCart = this.cartStore.clearCart;
  readonly totalPrice =  computed(()=>
    this.cartArr().reduce((acc, el)=>acc += el.price * el.quantity,0)
  )
}
