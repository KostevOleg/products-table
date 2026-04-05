import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsService } from '../../services/FetchService';
import { ProductDetailsComponent } from './product-details';

describe('ProductDetailsComponent', () => {
  const productStub = {
    id: 7,
    title: 'Perfume',
    description: 'Nice product',
    price: 99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 12,
    brand: 'Brand',
    category: 'fragrances',
    thumbnail: 'thumb.jpg',
    images: ['thumb.jpg', 'second.jpg'],
    tags: ['new'],
  };

  const productsServiceStub = {
    getProduct: vi.fn(() => of(productStub)),
  };

  const locationStub = {
    back: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '7',
              },
            },
          },
        },
        { provide: ProductsService, useValue: productsServiceStub },
        { provide: Location, useValue: locationStub },
      ],
    });
  });

  it('loads the product using the route id', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    const component = fixture.componentInstance;

    expect(productsServiceStub.getProduct).toHaveBeenCalledWith(7);
    expect(component.id).toBe(7);
    expect(component.product()?.title).toBe('Perfume');
    expect(component.loading()).toBe(false);
  });

  it('renders product details in the template', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.title')?.textContent).toContain('Perfume');
    expect(host.querySelectorAll('.thumbnails img')).toHaveLength(2);
    expect(host.textContent).toContain('Brand: Brand');
  });

  it('updates the selected image', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    const component = fixture.componentInstance;

    component.setImage('second.jpg');

    expect(component.selectedImage()).toBe('second.jpg');
  });

  it('navigates back through Location', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    const component = fixture.componentInstance;

    component.goBack();

    expect(locationStub.back).toHaveBeenCalled();
  });

  it('renders the selected image when it changes', () => {
    const fixture = TestBed.createComponent(ProductDetailsComponent);
    const component = fixture.componentInstance;

    component.setImage('second.jpg');
    fixture.detectChanges();

    const mainImage = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImage.src).toContain('second.jpg');
  });
});
