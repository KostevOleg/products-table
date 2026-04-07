import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartStore } from '../../stores/cart-store/cart-store';
import { CartComponent } from './cart-component';

describe('CartComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [CartStore],
    });
  });

  it('renders an empty state when the cart has no items', () => {
    const fixture = TestBed.createComponent(CartComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
  });

  it('renders cart items and the total price', () => {
    const store = TestBed.inject(CartStore);
    store.updateCart({
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
      quantity: 2,
    });

    const fixture = TestBed.createComponent(CartComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Phone');
    expect(host.textContent).toContain('$240.00');
    expect(host.textContent).toContain('Total: $240.00');
  });

  it('clears the cart when the clear button is clicked', () => {
    const store = TestBed.inject(CartStore);
    store.updateCart({
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
    });

    const fixture = TestBed.createComponent(CartComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const clearButton = Array.from(
      host.querySelectorAll('button'),
    ).find((button: Element) => button.textContent?.includes('Clear cart')) as HTMLButtonElement;

    clearButton.click();
    fixture.detectChanges();

    expect(store.items()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
  });
});
