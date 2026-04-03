import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Product, ProductsService } from '../../services/FetchService';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  readonly http = inject(ProductsService);
  readonly location = inject(Location);
  readonly activeRoute = inject(ActivatedRoute);
  readonly loading = signal(true);
  readonly id = Number(this.activeRoute.snapshot.paramMap.get('id'));

  readonly product = toSignal<Product | null>(
    this.http.getProduct(this.id).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
    ),
    { initialValue: null },
  );

  readonly selectedImage = signal<string | null>(null);

  setImage(url: string): void {
    this.selectedImage.set(url);
  }

  goBack(): void {
    this.location.back();
  }
}
