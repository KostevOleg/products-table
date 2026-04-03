import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs';

import { ProductsService } from '../../services/FetchService';

@Component({
  selector: 'app-main-comp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './products-component.html',
  styleUrl: './products-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  readonly categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ] as const;

  readonly productService = inject(ProductsService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly productsOnPage = signal(10);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly category = signal<string | null>(null);
  readonly sortBy = signal<string | null>(null);
  readonly order = signal<'asc' | 'desc' | null>(null);

  readonly visiblePages = computed(() => {
    const current = this.page();
    const last = this.totalPages() - 1;
    const pages = new Set<number>([current, current + 1, current + 2, current - 1, 0, last]);

    return Array.from(pages)
      .filter((pageNumber) => pageNumber >= 0 && pageNumber <= last)
      .sort((left, right) => left - right);
  });

  readonly params = computed(() => ({
    page: this.page(),
    limit: this.productsOnPage(),
    category: this.category(),
    sortBy: this.sortBy(),
    order: this.order(),
  }));

  readonly filterForm = this.fb.group({
    category: [''],
    limit: [10],
  });

  readonly params$ = toObservable(this.params);

  readonly products = toSignal(
    this.params$.pipe(
      debounceTime(600),
      distinctUntilChanged(
        (previous, current) =>
          previous.page === current.page &&
          previous.limit === current.limit &&
          previous.category === current.category &&
          previous.sortBy === current.sortBy &&
          previous.order === current.order,
      ),
      switchMap(({ page, limit, category, sortBy, order }) => {
        this.loading.set(true);

        return this.productService.getProducts({ page, limit, category, sortBy, order }).pipe(
          tap((response) => {
            const totalPages = Math.ceil(response.total / limit);
            this.totalPages.set(totalPages);
          }),
          map((response) => response.products),
          finalize(() => {
            this.loading.set(false);
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 0;
      const limit = +params['limit'] || 10;
      const category = params['category'] || '';
      const sortBy = params['sortBy'] || '';
      const order = params['order'] || '';

      this.page.set(page);
      this.productsOnPage.set(limit);
      this.category.set(category);
      this.sortBy.set(sortBy);
      this.order.set(order);
      this.filterForm.patchValue({ category, limit }, { emitEvent: false });
    });
  }

  goTo(page: number): void {
    this.updateQuery(page);
  }

  previousPage(): void {
    const currentPage = this.page();
    if (currentPage <= 0) {
      return;
    }

    this.updateQuery(currentPage - 1);
  }

  nextPage(): void {
    const currentPage = this.page();
    if (currentPage >= this.totalPages() - 1) {
      return;
    }

    this.updateQuery(currentPage + 1);
  }

  updateQuery(
    page: number,
    limit = this.productsOnPage(),
    category: string | null = this.category(),
    sortBy: string | null = this.sortBy(),
    order: 'asc' | 'desc' | null = this.order(),
  ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, limit, category, sortBy, order },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  goToProduct(id: number): void {
    this.router.navigate(['/product', id], {
      queryParamsHandling: 'preserve',
    });
  }

  applyFilters(): void {
    const { category, limit } = this.filterForm.value;
    this.updateQuery(0, limit ?? 10, category || null);
  }

  resetFilters(): void {
    this.filterForm.reset({ category: '', limit: 10 });
    this.updateQuery(0, 10, null, null, null);
  }

  toggleSort(field: string): void {
    if (this.sortBy() !== field) {
      this.sortBy.set(field);
      this.order.set('asc');
    } else {
      this.order.set(this.order() === 'asc' ? 'desc' : null);
    }

    this.updateQuery(0, this.productsOnPage(), this.category(), this.sortBy(), this.order());
  }
}
