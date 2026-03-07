import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // login + register
  if (localStorage.getItem('socialToken')) {
    // navigate home
    return router.parseUrl('/home');
  } else {
    return true;
  }
};
