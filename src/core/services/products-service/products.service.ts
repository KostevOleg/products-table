import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ServerResponse } from '../../../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);
  readonly baseUrl = '/products';

  getProducts(params: {
    page: number;
    limit: number;
    category?: string | null;
    sortBy?: string | null;
    order?: 'asc' | 'desc' | null;
  }) {
    const { page, limit, category, sortBy, order } = params;
    const baseUrl = category ? `${this.baseUrl}/category/${category}` : this.baseUrl;

    const skip = page * limit;

    let httpParams = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (sortBy) {
      httpParams = httpParams.set('sortBy', sortBy);
      if (order) {
        httpParams = httpParams.set('order', order);
      }
    }
    return this.http.get<ServerResponse>(baseUrl, {
      params: httpParams,
    });
  }

  getRandomProducts(quantity: number) {
    const skip = Math.floor(Math.random() * 160);
    const httpParams = new HttpParams()
      .set('limit', quantity)
      .set('skip', skip);

    return this.http.get<ServerResponse>(this.baseUrl, {
      params: httpParams,
    });
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
