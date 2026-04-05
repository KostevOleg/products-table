import { TestBed } from '@angular/core/testing';
import { throwError, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsService } from '../services/FetchService';
import { ProductsStore } from './store';

describe('ProductsStore', () => {
  const productsServiceStub = {
    getProducts: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        { provide: ProductsService, useValue: productsServiceStub },
      ],
    });
  });

  it('loads products and calculates total pages', () => {
    productsServiceStub.getProducts.mockReturnValue(
      of({
        products: [{ id: 1, title: 'Phone' }],
        total: 21,
        skip: 0,
        limit: 10,
      }),
    );

    const store = TestBed.inject(ProductsStore);
    store.loadProducts({ page: 1, limit: 10, category: 'smartphones' });

    expect(productsServiceStub.getProducts).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      category: 'smartphones',
      sortBy: null,
      order: null,
    });
    expect(store.products()).toEqual([{ id: 1, title: 'Phone' }]);
    expect(store.totalPages()).toBe(3);
    expect(store.isLoading()).toBe(false);
    expect(store.hasError()).toBe(false);
  });

  it('marks the store as failed when the request errors', () => {
    productsServiceStub.getProducts.mockReturnValue(
      throwError(() => new Error('network')),
    );

    const store = TestBed.inject(ProductsStore);
    store.updateStore({ products: [{ id: 1, title: 'Old' } as never] });
    store.loadProducts({ limit: 10 });

    expect(store.products()).toEqual([]);
    expect(store.totalPages()).toBe(0);
    expect(store.hasError()).toBe(true);
    expect(store.isLoading()).toBe(false);
  });

  it('merges state updates', () => {
    const store = TestBed.inject(ProductsStore);

    store.updateStore({ page: 2, sortBy: 'price', order: 'asc' });

    expect(store.page()).toBe(2);
    expect(store.sortBy()).toBe('price');
    expect(store.order()).toBe('asc');
  });
});
