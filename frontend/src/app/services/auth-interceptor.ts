import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService:UserService) { }

  intercept(req: HttpRequest<any>, next:HttpHandler) {
    let token = this.userService.getToken();
    if (!token)
      token = sessionStorage.getItem('token') || '';

    const request = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + token)
    })
    return next.handle(request);
  }
}
