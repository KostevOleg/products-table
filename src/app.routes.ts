import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart-component';
import { HomeComponent } from './components/home/home-component';
import { LandingComponent } from './components/landing/landing-component';
import { LoginComponent } from './components/login/login-component/login-component';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { MainComponent } from './components/products-component/products-component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product',
    component: MainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
