  import { Component, computed, inject, OnInit, signal } from '@angular/core';
  import {ProductsService,} from '../../services/FetchService';
  import { toObservable, toSignal } from '@angular/core/rxjs-interop'
  import { map, switchMap, tap, distinctUntilChanged, debounceTime, finalize } from 'rxjs';
  import {ReactiveFormsModule} from "@angular/forms";
  import {Router, ActivatedRoute} from "@angular/router";
  import { FormBuilder } from '@angular/forms';

  @Component({
    selector: 'app-main-comp',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './products-component.html',
    styleUrl: './products-component.scss'
  })
  export class MainComponent  implements OnInit{
    ngOnInit(): void {
      this.route.queryParams.subscribe(param => {
        const page = +param['page'] || 0;
        const limit = +param['limit'] || 10;
        const category = param['category'] || '';
        const sortBy = param['sortBy'] || '';
        const order = param['order'] || '';

        this.page.set(page);
        this.productsOnPage.set(limit);
        this.category.set(category);
        this.sortBy.set(sortBy);
        this.order.set(order)
        this.filterForm.patchValue(
          {category, limit},
          {emitEvent: false}
        )

    })
    }
    productService = inject(ProductsService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    fb = inject(FormBuilder);

    loading = signal(true);
    productsOnPage = signal(10);
    page = signal(0);
    totalPages = signal(0);
    category = signal<string | null>(null);
    sortBy = signal<string | null>(null);
    order = signal<'asc'|'desc' | null>(null)

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
    params = computed(()=>({
      page : this.page(),
      limit: this.productsOnPage(),
      category : this.category(),
      sortBy : this.sortBy(),
      order : this.order()
    }))
    
    filterForm = this.fb.group({
      category: [''],
      limit: [10]
    })

    params$ = toObservable(this.params);
    products = toSignal(
      this.params$.pipe(
        debounceTime(600),
        distinctUntilChanged((a, b) => a.page === b.page && a.limit === b.limit && a.category === b.category && a.sortBy === b.sortBy && a.order === b.order),
        switchMap(({page, limit, category, sortBy , order}) => {
          return this.productService.getProducts({page, limit, category , sortBy, order}).pipe(
            tap((data)=>{
              this.loading.set(true)
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
      this.updateQuery(p)
    }
    previousPage(){
      let currentPage = this.page();
      if (currentPage <= 0) return;
      let newPage = currentPage - 1;
      this.updateQuery(newPage)
    }
    nextPage(){
      let currentPage = this.page();
      if (currentPage >= (this.totalPages() - 1)) return;
      let newPage = currentPage + 1;
      this.updateQuery(newPage)
    }
    updateQuery(
      page: number,
      limit=this.productsOnPage(),
      category : string | null = this.category(),
      sortBy: string | null = this.sortBy(),
      order: 'asc' | 'desc' | null = this.order()
    ){
        this.router.navigate([],{
          relativeTo: this.route,
          queryParams: {page, limit, category, sortBy, order},
          queryParamsHandling: 'merge',
          replaceUrl: true
        }
        )
    }
    goToProduct(id: number):void{
      this.router.navigate(['/product', id], {
        queryParamsHandling: 'preserve'
      })
    }
    applyFilters(){
      const {category, limit} = this.filterForm.value;
      const page = this.page()
      this.updateQuery(page, limit!, category || null)
    }
    resetFilters() {
      this.filterForm.reset({ category: '', limit: 10 });
      this.updateQuery(0, 10, null, null, null);
      
    }
    toggleSort(field:string){
      if(this.sortBy() !== field){
        this.sortBy.set(field);
        this.order.set('asc')
      } else {
        this.order.set(this.order() === 'asc' ? 'desc' : null)
      }
      this.updateQuery(
        0,
        this.productsOnPage(),
        this.category(),
        this.sortBy(),
        this.order()
      )
    }
  }