import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { CartStore } from '../../stores/cart-store/cart-store';
import { CartDialogComponent } from '../../shared/cart-dialog/cart-dialog';
import { HeaderComponent } from './header-component';

describe('HeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [CartStore, provideRouter([])],
    });
  });

  it('keeps the cart dialog hidden by default', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.cart-dialog') as HTMLElement;
    expect(dialog.classList.contains('hidden')).toBe(true);
  });

  it('opens the cart dialog on mouseenter and closes it on mouseleave', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    fixture.detectChanges();

    const cartArea = fixture.nativeElement.querySelector('.header-cart') as HTMLElement;
    const dialog = fixture.nativeElement.querySelector('.cart-dialog') as HTMLElement;

    cartArea.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(dialog.classList.contains('hidden')).toBe(false);

    cartArea.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(dialog.classList.contains('hidden')).toBe(true);
  });

  it('closes the cart dialog when the dialog emits close', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.openModalCart();
    fixture.detectChanges();

    const dialogComponent = fixture.debugElement.query(By.directive(CartDialogComponent))
      .componentInstance as CartDialogComponent;

    dialogComponent.closeModal();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.cart-dialog') as HTMLElement;
    expect(dialog.classList.contains('hidden')).toBe(true);
  });
});
