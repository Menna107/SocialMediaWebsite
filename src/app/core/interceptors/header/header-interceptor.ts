import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Request
  if (localStorage.getItem('socialToken')) {
    req = req.clone({
      setHeaders: {
        authorization: `Bearer ${localStorage.getItem('socialToken')}`,
      },
    });
  }
  return next(req); //Response
};
