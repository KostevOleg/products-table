import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductsService } from './products.service';
import { ServerResponse, Product } from '../../../models/product-model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockResponse: ServerResponse = {
    products: [
      {
        id: 1,
        title: 'Phone',
        description: 'Smartphone',
        category: 'electronics',
        price: 100,
        discountPercentage: 10,
        rating: 4.5,
        stock: 5,
        tags: [],
        brand: 'TestBrand',
        warrantyInformation: '1 year',
        shippingInformation: 'Ships tomorrow',
        images: [],
        thumbnail: '',
      },
    ],
    total: 1,
    skip: 0,
    limit: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products with pagination params', () => {
    service.getProducts({ page: 2, limit: 10 }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url === '/products' &&
      request.params.get('limit') === '10' &&
      request.params.get('skip') === '20'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get products by category', () => {
    service.getProducts({ page: 0, limit: 5, category: 'beauty' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url === '/products/category/beauty' &&
      request.params.get('limit') === '5' &&
      request.params.get('skip') === '0'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should add sort params when sortBy and order are provided', () => {
    service.getProducts({ page: 0, limit: 10, sortBy: 'price', order: 'asc' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url === '/products' &&
      request.params.get('sortBy') === 'price' &&
      request.params.get('order') === 'asc'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get random products', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    service.getRandomProducts(3).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url === '/products' &&
      request.params.get('limit') === '3' &&
      request.params.get('skip') === '0'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get product by id', () => {
    const product: Product = mockResponse.products[0];

    service.getProduct(1).subscribe((response) => {
      expect(response).toEqual(product);
    });

    const req = httpMock.expectOne('/products/1');

    expect(req.request.method).toBe('GET');
    req.flush(product);
  });
});
