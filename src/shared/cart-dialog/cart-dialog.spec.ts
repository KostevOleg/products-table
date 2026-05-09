import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CartStore } from '../../stores/cart-store/cart-store';
import { CartDialogComponent } from './cart-dialog';

describe('CartDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CartDialogComponent],
      providers: [CartStore, provideRouter([])],
    });
  });

  it('renders an empty state when the cart has no items', () => {
    const fixture = TestBed.createComponent(CartDialogComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
  });

  it('renders cart items when the cart has products', () => {
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

    const fixture = TestBed.createComponent(CartDialogComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Phone');
    expect(host.textContent).toContain('$120');
    expect(host.querySelector('img')?.getAttribute('src')).toBe('phone.jpg');
    expect(host.querySelector('.cart-preview__link')?.textContent).toContain('Open Cart');
  });

  it('emits close when the close button is clicked', () => {
    const fixture = TestBed.createComponent(CartDialogComponent);
    const component = fixture.componentInstance;
    const closeSpy = vi.fn();

    component.close.subscribe(closeSpy);
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.cart-preview__close') as HTMLButtonElement;
    closeButton.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
