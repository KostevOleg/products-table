import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (_route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(authService.isAuth()){
    return true }



  return router.createUrlTree(['/login'],{
    queryParams :{
      returnUrl: state.url
    }
  });
};
