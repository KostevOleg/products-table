import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService{
  http = inject(HttpClient);
  getProducts(params : {
    page:number,
    limit:number,
    category?: string | null
  }){
    const {page, limit, category} = params
    let skip = page  * limit;
    const baseUrl = category ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}` : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    return  this.http.get<ServerResponse>(baseUrl)
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