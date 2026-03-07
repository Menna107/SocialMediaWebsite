import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // check token:
  if (localStorage.getItem('socialToken')) {
    return true;
  } else {
    // navigate login
    return router.parseUrl('/login');
  }
};
