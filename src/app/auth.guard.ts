import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './service/login.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  // Prüfe, ob der Benutzer eingeloggt ist
  if (loginService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
