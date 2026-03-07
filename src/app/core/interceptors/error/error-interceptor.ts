import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Req
  const toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      console.log('Error intercepted:', err);
      toastrService.error(err.error.message);
      return throwError(() => err);
    }),
  );
};
