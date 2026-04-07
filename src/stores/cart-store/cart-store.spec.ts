import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartItem } from '../../models/cart-model';
import { CartStore } from './cart-store';

describe('CartStore', () => {
  const product: CartItem = {
    id: 1,
    title: 'Phone',
    description: 'Flagship phone',
    price: 120,
    discountPercentage: 10,
    rating: 4.8,
    stock: 5,
    brand: 'Tech',
    category: 'smartphones',
    thumbnail: 'phone.jpg',
    images: ['phone.jpg'],
    quantity: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore],
    });
  });

  it('adds a new item to the cart', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart(product);

    expect(store.items()).toEqual([product]);
  });

  it('increments quantity when adding an existing item', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart(product);
    store.updateCart({ ...product, quantity: 1 });

    expect(store.items()).toEqual([{ ...product, quantity: 2 }]);
  });

  it('increases quantity by id', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart(product);
    store.increaseQuantity(product.id);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('decreases quantity by id and removes the item at zero', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart({ ...product, quantity: 2 });
    store.decreaseQuantity(product.id);
    expect(store.items()[0].quantity).toBe(1);

    store.decreaseQuantity(product.id);
    expect(store.items()).toEqual([]);
  });

  it('removes an item from the cart', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart(product);
    store.removeFromCart(product.id);

    expect(store.items()).toEqual([]);
  });

  it('clears the cart', () => {
    const store = TestBed.inject(CartStore);

    store.updateCart(product);
    store.clearCart();

    expect(store.items()).toEqual([]);
  });
});
