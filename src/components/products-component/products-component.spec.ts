import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsService } from '../../services/FetchService';
import { MainComponent } from './products-component';

describe('MainComponent', () => {
  const activatedRouteStub = {
    queryParams: of({ page: 1, limit: 10, category: 'laptops', sortBy: 'price', order: 'asc' }),
  };

  const productsServiceStub = {
    getProducts: () =>
      of({
        products: [],
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
    expect(component.productsOnPage()).toBe(10);
    expect(component.category()).toBe('laptops');
    expect(component.sortBy()).toBe('price');
    expect(component.order()).toBe('asc');
  });

  it('resets page number when applying filters', async () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.filterForm.setValue({ category: 'groceries', limit: 20 });
    component.page.set(3);

    component.applyFilters();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 0,
        limit: 20,
        category: 'groceries',
        sortBy: null,
        order: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('cycles sorting state between asc, desc, and none', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    const updateQuerySpy = vi.spyOn(component, 'updateQuery');

    component.toggleSort('price');
    expect(component.sortBy()).toBe('price');
    expect(component.order()).toBe('asc');

    component.toggleSort('price');
    expect(component.order()).toBe('desc');

    component.toggleSort('price');
    expect(component.order()).toBe(null);
    expect(updateQuerySpy).toHaveBeenCalledTimes(3);
  });
});
