import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string = '';
  private username: string = '';
  private userTypeId: number = 0;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private errorMsg: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login(user: { username: string, password: string }) {
    this.http.post<User>(`${environment.backend_url}/login`, user).subscribe({
      next: (user: User) => {
        this.token = user.token;
        this.username = user.username;
        this.setTimer(user.expiresIn);
        const expireDate = new Date().getTime() + user.expiresIn * 1000;
        this.saveAuthData(this.token, new Date(expireDate), this.username, user.userTypeId)
        this.authStatusListener.next(true)
      },
      error: (err) => {
        this.errorMsg = err.error.message
        this.authStatusListener.next(false)
      }
    })
  }

  logout() {
    sessionStorage.clear()
    this.clearAuthData()
    this.token = ''
    this.username = ''
    clearTimeout(this.tokenTimer)
    // Notify all listeners 
    this.authStatusListener.next(false)
    this.router.navigate(['/'])
  }

  private setTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);
    this.authStatusListener.next(true);
  }

  private saveAuthData(token: string, expirationDate: Date, username: string, userTypeId: number) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expirationDate', expirationDate.toISOString());
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userTypeId', String(userTypeId));
  }

  private clearAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expirationDate');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userTypeId');
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date()
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = `${authData.token}`;
      this.username = `${authData.username}`;
      this.setTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
    else {
      console.log('Expired token');
    }
  }

  private getAuthData() {
    let expirationDate = new Date();
    const dateStr = sessionStorage.getItem('expirationDate');
    if (dateStr)
      expirationDate = new Date(dateStr);
    return {
      token: localStorage.getItem("token"),
      expirationDate,
      username: localStorage.getItem('username'),
    };
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAuthenticated() {
    return sessionStorage.getItem('token') || '';
  }

  getToken() {
    return this.token = sessionStorage.getItem('token') || '';
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  getErrorMsg() {
    return this.errorMsg;
  }

  getUserTypeId() {
    return Number(sessionStorage.getItem('userTypeId'));
  }

}
