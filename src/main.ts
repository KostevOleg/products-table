import { bootstrapApplication } from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app-component';
import {MainComponent} from './components/main-component/main-component';
import {ProductDetailsComponent} from './components/product-detail/product-details';
const routes: Routes = [
  {
    path: '',
    component: MainComponent
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

