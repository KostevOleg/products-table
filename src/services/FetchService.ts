import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService{
  http = inject(HttpClient);
  getProducts(params : {
    page:number,
    limit:number,
    category?: string | null,
    sortBy?:string | null,
    order?: 'asc' | "desc" | null,
  }){
    const {page, limit, category, sortBy , order} = params;
    const baseUrl = category ? `https://dummyjson.com/products/category/${category}` : 
    `https://dummyjson.com/products`;

    let skip = page  * limit;
    
    let httpParams = new HttpParams()
    .set('limit' , limit)
    .set('skip', skip)
    
    if(sortBy){
      httpParams = httpParams.set('sortBy', sortBy)
      if(order){
        httpParams = httpParams.set('order', order)
      }
    }
    return  this.http.get<ServerResponse>(baseUrl, {
      params: httpParams
    })
  }
  getProduct(id:number){
    return this.http.get<Product>(`https://dummyjson.com/products/${id}`)
  }
}

export interface ServerResponse {
  products: Product[],
  total: number,
  skip: number,
  limit: number,
}

export interface Product {
  id: number;
  title: string;
  description: string;

  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;

  brand: string;
  category: string;

  thumbnail: string;
  images: string[];

  tags?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
}