import { Component, inject, signal } from '@angular/core';
import {ProductsService, Product} from '../../services/FetchService';
import {ActivatedRoute, RouterLink} from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop'
import { finalize } from 'rxjs';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetailsComponent {
  http = inject(ProductsService);
  activeRoute = inject(ActivatedRoute);
  loading = signal(true)
  id = Number(this.activeRoute.snapshot.paramMap.get('id'));
  product = toSignal<Product | null>(
    this.http.getProduct(this.id).pipe(
      finalize(()=>{
        this.loading.set(false)
      })
    ),
    { initialValue: null },
  );
  selectedImage = signal<string | null>(null);

setImage(url: string) {
  this.selectedImage.set(url);
}

}