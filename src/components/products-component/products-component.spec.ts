import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsService } from '../../core/services/products-service/products.service';
import { MainComponent } from './products-component';

describe('MainComponent', () => {
  const activatedRouteStub = {
    queryParams: of({ page: 1, limit: 10, category: 'laptops', sortBy: 'price', order: 'asc' }),
  };

  const productsServiceStub = {
    getProducts: () =>
      of({
        products: [
          {
            id: 1,
            title: 'Laptop',
            description: 'Portable',
            price: 1000,
            discountPercentage: 5,
            rating: 4.8,
            stock: 7,
            brand: 'Tech',
            category: 'laptops',
            thumbnail: 'thumb.jpg',
            images: [],
          },
        ],
        total: 35,
        skip: 0,
        limit: 10,
      }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ProductsService, useValue: productsServiceStub },
      ],
    });
  });

  it('syncs state from query params on init', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;

    component.ngOnInit();

    expect(component.page()).toBe(1);
    expect(component.store.limit()).toBe(10);
    expect(component.store.category()).toBe('laptops');
    expect(component.sortBy()).toBe('price');
    expect(component.order()).toBe('asc');
  });

  it('renders loaded products in the table', () => {
    const fixture = TestBed.createComponent(MainComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.table-title')?.textContent).toContain('All products');
    expect(host.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(host.textContent).toContain('Laptop');
  });

  it('shows an empty state when the api returns no products', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: ProductsService,
          useValue: {
            getProducts: () =>
              of({
                products: [],
                total: 0,
                skip: 0,
                limit: 10,
              }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No products found');
  });

  it('shows an error state when loading fails', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: ProductsService,
          useValue: {
            getProducts: () => throwError(() => new Error('network')),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Unable to load products');
  });

  it('resets page number when applying filters', async () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.filterForm.setValue({ category: 'groceries', limit: 20 });
    component.store.updateStore({ page: 3 });

    component.applyFilters();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 0,
        limit: 20,
        category: 'groceries',
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('resets filters and sorting to defaults', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    const updateQuerySpy = vi.spyOn(component, 'updateQuery');

    component.filterForm.setValue({ category: 'groceries', limit: 20 });
    component.resetFilters();

    expect(component.filterForm.getRawValue()).toEqual({
      category: '',
      limit: 10,
    });
    expect(updateQuerySpy).toHaveBeenCalledWith({
      page: 0,
      category: null,
      limit: 10,
      sortBy: null,
      order: null,
    });
  });

  it('normalizes invalid query params to safe defaults', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ page: -2, limit: 0 }),
          },
        },
        { provide: ProductsService, useValue: productsServiceStub },
      ],
    });

    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;

    component.ngOnInit();

    expect(component.page()).toBe(0);
    expect(component.store.limit()).toBe(10);
  });

  it('toggles sorting between asc and desc for the same field', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    const updateQuerySpy = vi.spyOn(component, 'updateQuery');

    component.toggleSort('price');
    expect(updateQuerySpy).toHaveBeenNthCalledWith(1, {
      page: 0,
      sortBy: 'price',
      order: 'asc',
    });

    component.store.updateStore({ sortBy: 'price', order: 'asc' });
    component.toggleSort('price');
    expect(updateQuerySpy).toHaveBeenNthCalledWith(2, {
      page: 0,
      sortBy: 'price',
      order: 'desc',
    });
  });
});
