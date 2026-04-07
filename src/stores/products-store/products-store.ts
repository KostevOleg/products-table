import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/FetchService';
import { Product } from '../../models/product-model';

type ProductsState = {
  products: Product[];
  isLoading: boolean;
  hasError: boolean;
  page: number;
  limit: number;
  totalPages: number;
  category: string | null;
  sortBy: string | null;
  order: 'asc' | 'desc' | null;
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<ProductsState>({
    products: [],
    isLoading: false,
    hasError: false,
    page: 0,
    limit: 10,
    totalPages: 0,
    category: null,
    sortBy: null,
    order: null,
  }),
  withMethods((store) => {
    const api = inject(ProductsService);
    let requestSub: Subscription | null = null;

    return {
      loadProducts(
        params?: Partial<{
          page: number;
          limit: number;
          category: string | null;
          sortBy: string | null;
          order: 'asc' | 'desc' | null;
        }>,
      ) {
        const nextPage = params?.page ?? store.page();
        const nextLimit = params?.limit ?? store.limit();
        const nextCategory = params?.category ?? store.category();
        const nextSortBy = params?.sortBy ?? store.sortBy();
        const nextOrder = params?.order ?? store.order();
        
        patchState(store, {
          page: nextPage,
          limit: nextLimit,
          category: nextCategory,
          sortBy: nextSortBy,
          order: nextOrder,
          isLoading: true,
          hasError: false,
        });

        requestSub?.unsubscribe();

        requestSub = api
          .getProducts({
            page: nextPage,
            limit: nextLimit,
            category: nextCategory,
            sortBy: nextSortBy,
            order: nextOrder,
          })
          .subscribe({
            next: (response) => {
              patchState(store, {
                products: response.products,
                totalPages: Math.ceil(response.total / nextLimit),
                isLoading: false,
              });
            },
            error: () => {
              patchState(store, {
                products: [],
                totalPages: 0,
                hasError: true,
                isLoading: false,
              });
            },
          });
      },
      updateStore(state :Partial<ProductsState>){
        patchState(store, (current)=>({
          ...current,
          ... state
        }))
      }
    };
  }),
);
