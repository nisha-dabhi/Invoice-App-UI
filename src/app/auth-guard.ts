import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
 const auth = inject(LoginService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
