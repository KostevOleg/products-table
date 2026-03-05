import { Component, computed, inject, signal } from '@angular/core';
import {ProductsService, Product} from '../../services/FetchService'
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {RouterLink} from '@angular/router'

@Component({
  selector: 'app-landing-component',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent {
  http = inject(ProductsService)
  currentIndex = signal(0);
  cardWidth = 310;
  gap = 24;
  visible = signal(4);
  step = computed(()=>{
    return this.cardWidth + this.gap;
  }) 
  maxIndex = computed(()=>{
    const total = this.promoProducts().length;
    return Math.max(total - this.visible(), 0)
  })  
  translate = computed(()=>{
    return `translateX(-${this.currentIndex() * this.step()}px)`
  })

  promoProducts = toSignal(
      this.http.getRandomProducts(12).pipe(
        map(data => data.products)
      ),
      {initialValue: []}
  )
  nexSlide(){
    let current = this.currentIndex();
    const maxIndex = this.maxIndex();
    if(maxIndex ===0) return
    if(current === maxIndex){
      this.currentIndex.set(0)
      return
    }
      this.currentIndex.update(v => v + 1)
  }
  prevSlide(){
    let current = this.currentIndex();
    const maxIndex = this.maxIndex();
    if(maxIndex ===0) return
    if(current <= 0) {
        this.currentIndex.set(maxIndex);
        return
    }
    this.currentIndex.update(v => Math.max(v -1, 0))
  }
}
