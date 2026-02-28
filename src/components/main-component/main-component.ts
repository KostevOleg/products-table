import { Component, computed, inject, signal } from '@angular/core';
import {ProductsService, Product} from '../../services/FetchService';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { map, switchMap, tap, distinctUntilChanged, debounceTime, finalize } from 'rxjs';
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-comp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss'
})
export class MainComponent {
  productService = inject(ProductsService);
  router = inject(Router);
  params = computed(()=>({
    page : this.page(),
    limit: this.productsOnPage()
  }))
  loading = signal(true)
  productsOnPage = signal(10)
  page = signal(0);
  totalPages = signal(0);
  visiblePages = computed(() => {
    const current = this.page();
    const last = this.totalPages() - 1;
  
    const pages = new Set<number>();
    pages.add(current);
  
    pages.add(current + 1);
    pages.add(current + 2);
  
    pages.add(current - 1);
    pages.add(0);
    pages.add(last);
 
    return Array.from(pages)
      .filter(p => p >= 0 && p <= last)
      .sort((a, b) => a - b);
  });

  params$ = toObservable(this.params);
  products = toSignal(
    this.params$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(({page, limit}) => {
        return this.productService.getProducts(page, limit).pipe(
          tap((data)=>{
            let quat = Math.ceil(data.total / limit)
            this.totalPages.set(quat);
          }),
          map(data => data.products),
          finalize(()=>{
            this.loading.set(false)
          })
        )
      })
    ),
    {initialValue: []}
  )
  goTo(p:number){
    this.page.set(p)
  }
  previousPage(){
    let currentPage = this.page();
    if (currentPage === 0) return;
    let newPage = currentPage - 1;
    this.page.set(newPage)
  }
  nextPage(){
    let currentPage = this.page();
    if (currentPage === (this.totalPages() - 1)) return;
    let newPage = currentPage + 1;
    this.page.set(newPage)
  }
  goToProduct(id: number):void{
     this.router.navigate(['/product', id])
  }
}