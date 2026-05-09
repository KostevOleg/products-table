import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service/auth-service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.accessToken()
  
  if(!accessToken){
    return next(req)
  }
  
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  return next(newReq).pipe(
      catchError((err: HttpErrorResponse) => {
        const isAuthRequest =
          req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

        if (err.status !== 401 || isAuthRequest || !authService.refreshToken()) {
          return throwError(() => err);
        }

        return authService.getNewAccesToken().pipe(
          switchMap((res) => {
            authService.accessToken.set(res.accessToken);
            authService.refreshToken.set(res.refreshToken);
            localStorage.setItem('refreshToken', res.refreshToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.accessToken.set(null);
            authService.refreshToken.set(null);
            authService.user.set(null);
            localStorage.removeItem('refreshToken');

            return throwError(() => refreshErr);
          })
        );
      })
    );
};
