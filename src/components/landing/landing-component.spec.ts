import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductsService } from '../../services/FetchService';
import { LandingComponent } from './landing-component';

describe('LandingComponent', () => {
  const productsServiceStub = {
    getRandomProducts: () =>
      of({
        products: Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          title: `Product ${index + 1}`,
          description: '',
          price: index + 10,
          discountPercentage: 0,
          rating: 0,
          stock: 0,
          brand: 'Brand',
          category: 'category',
          thumbnail: `thumb-${index + 1}.jpg`,
          images: [],
        })),
        total: 12,
        skip: 0,
        limit: 12,
      }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceStub },
      ],
    });
  });

  it('moves forward and wraps after the last slide', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const component = fixture.componentInstance;

    expect(component.maxIndex()).toBe(8);

    component.currentIndex.set(7);
    component.nextSlide();
    expect(component.currentIndex()).toBe(8);

    component.nextSlide();
    expect(component.currentIndex()).toBe(0);
  });

  it('moves backward and wraps to the end from the first slide', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const component = fixture.componentInstance;

    component.prevSlide();
    expect(component.currentIndex()).toBe(8);
  });
});
