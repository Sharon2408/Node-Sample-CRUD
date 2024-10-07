import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/services/auth-service.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLogged = authService.getToken();
  if (!isLogged) router.navigateByUrl('/auth/login');
  return isLogged;
};
