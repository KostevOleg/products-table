import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsService } from './FetchService';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    httpMock.verify();
  });

  it('requests products with pagination and sorting params', () => {
    service
      .getProducts({ page: 2, limit: 10, category: 'smartphones', sortBy: 'price', order: 'desc' })
      .subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://dummyjson.com/products/category/smartphones',
    );

    expect(request.request.params.get('limit')).toBe('10');
    expect(request.request.params.get('skip')).toBe('20');
    expect(request.request.params.get('sortBy')).toBe('price');
    expect(request.request.params.get('order')).toBe('desc');

    request.flush({ products: [], total: 0, skip: 20, limit: 10 });
  });

  it('requests products from the base endpoint when category is not set', () => {
    service.getProducts({ page: 0, limit: 12 }).subscribe();

    const request = httpMock.expectOne((req) => req.url === 'https://dummyjson.com/products');

    expect(request.request.params.get('limit')).toBe('12');
    expect(request.request.params.get('skip')).toBe('0');
    expect(request.request.params.has('sortBy')).toBe(false);

    request.flush({ products: [], total: 0, skip: 0, limit: 12 });
  });

  it('requests a random products slice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    service.getRandomProducts(6).subscribe();

    const request = httpMock.expectOne((req) => req.url === 'https://dummyjson.com/products');

    expect(request.request.params.get('limit')).toBe('6');
    expect(request.request.params.get('skip')).toBe('80');

    request.flush({ products: [], total: 0, skip: 80, limit: 6 });
  });

  it('requests a single product by id', () => {
    service.getProduct(17).subscribe();

    const request = httpMock.expectOne('https://dummyjson.com/products/17');
    expect(request.request.method).toBe('GET');

    request.flush({ id: 17 });
  });
});
