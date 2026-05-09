import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `https://dummyjson.com${req.url}`,
  });

  return next(apiReq);
};
