import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/FetchService';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-component',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly http = inject(ProductsService);
  readonly currentIndex = signal(0);
  readonly cardWidth = 310;
  readonly gap = 24;
  readonly visible = signal(4);
  readonly step = computed(() => this.cardWidth + this.gap);
  readonly maxIndex = computed(() => {
    const total = this.promoProducts().length;
    return Math.max(total - this.visible(), 0);
  });
  readonly translate = computed(() => `translateX(-${this.currentIndex() * this.step()}px)`);

  readonly promoProducts = toSignal(
    this.http.getRandomProducts(12).pipe(
      map((data) => data.products),
    ),
    { initialValue: [] },
  );

  nextSlide(): void {
    const current = this.currentIndex();
    const maxIndex = this.maxIndex();

    if (maxIndex === 0) {
      return;
    }

    if (current === maxIndex) {
      this.currentIndex.set(0);
      return;
    }

    this.currentIndex.update((value) => value + 1);
  }

  prevSlide(): void {
    const maxIndex = this.maxIndex();

    if (maxIndex === 0) {
      return;
    }

    if (this.currentIndex() <= 0) {
      this.currentIndex.set(maxIndex);
      return;
    }

    this.currentIndex.update((value) => Math.max(value - 1, 0));
  }
}
