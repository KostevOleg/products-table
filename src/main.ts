import { bootstrapApplication } from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app-component';
import {MainComponent} from './components/products-component/products-component';
import {ProductDetailsComponent} from './components/product-details/product-details';
import {LandingComponent} from './components/landing/landing-component';
import { ReviewsComponent } from './components/reviews-component/reviews-component';
const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'product',
    component: MainComponent
  },
  {
    path: 'reviews',
    component: ReviewsComponent
  },
  {
    path : 'product/:id',
    component : ProductDetailsComponent
  }
  ];


bootstrapApplication(AppComponent,{
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});

