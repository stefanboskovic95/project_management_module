import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    const isAuth = this.userService.getToken() !== '';
    if (!isAuth) {
      this.router.navigate(['/']);
    }
    return isAuth;
  }
}
