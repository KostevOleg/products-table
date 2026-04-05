import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore } from '../../store/store';
import { PaginationComponent } from '../pagination/pagination-component';
import { ProductsQuery } from '../models/query-model';

@Component({
  selector: 'app-main-comp',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent],
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

  readonly store = inject(ProductsStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);
  readonly destroyRef = inject(DestroyRef);

  readonly loading = this.store.isLoading;
  readonly hasError = this.store.hasError;
  readonly page = this.store.page;
  readonly totalPages = this.store.totalPages;
  readonly sortBy = this.store.sortBy;
  readonly order = this.store.order;
  readonly products = this.store.products;
  readonly visiblePages = computed(() => {
    const current = this.page();
    const last = this.totalPages() - 1;
    const pages = new Set([0, current - 1, current, current + 1, current + 2, last]);

    return Array.from(pages)
      .filter((p) => p >= 0 && p <= last)
      .sort((a, b) => a - b);
  });


  readonly filterForm = this.fb.group({
    category: [''],
    limit: [10],
  });


  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const query: ProductsQuery = {
          page: this.parsePage(params['page']),
          limit: this.parseLimit(params['limit']),
          category: params['category'] || null,
          sortBy: params['sortBy'] || null,
          order: params['order'] === 'asc' || params['order'] === 'desc'
            ? params['order']
            : null,
        };

        this.store.updateStore(query);
        this.filterForm.patchValue(
          { category: query.category ?? '', limit: query.limit },
          { emitEvent: false },
        );
        this.store.loadProducts(query);
      });
  }

  updateQuery(params: Partial<ProductsQuery>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
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
    this.updateQuery({
      page: 0,
      category: category || null,
      limit: this.parseLimit(limit),
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ category: '', limit: 10 });
    this.updateQuery({
      page: 0,
      category: null,
      limit: 10,
      sortBy: null,
      order: null,
    });
  }

  onPaginationChange(page: number): void {
    this.updateQuery({ page });
  }

  toggleSort(field: string): void {
    if (this.sortBy() === field) {
      const nextOrder = this.order() === 'asc' ? 'desc' : 'asc';
      this.updateQuery({ page: 0, sortBy: field, order: nextOrder });
      return;
    }

    this.updateQuery({ page: 0, sortBy: field, order: 'asc' });
  }

  private parsePage(value: unknown): number {
    const page = Number(value);
    return Number.isInteger(page) && page >= 0 ? page : 0;
  }

  private parseLimit(value: unknown): number {
    const limit = Number(value);
    return Number.isInteger(limit) && limit > 0 ? limit : 10;
  }
}
