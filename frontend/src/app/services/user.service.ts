import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string = '';
  private username: string = '';
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private errorMsg: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(user: { username: string; password: string }) {
    this.http.post<User>(`${environment.backend_url}/login`, user).subscribe({
      next: (user: User) => {
        this.token = user.token;
        this.username = user.username;
        this.setTimer(user.expiresIn);
        const expireDate = new Date().getTime() + user.expiresIn * 1000;
        this.saveAuthData(this.token, new Date(expireDate), this.username, user.type, user.departmentId);
        this.authStatusListener.next(true);
      },
      error: (err) => {
        this.errorMsg = err.error.message;
        this.authStatusListener.next(false);
      },
    });
  }

  logout() {
    sessionStorage.clear();
    this.clearAuthData();
    this.token = '';
    this.username = '';
    clearTimeout(this.tokenTimer);
    // Notify all listeners
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  private setTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
    this.authStatusListener.next(true);
  }

  getUserTypes() {
    return this.http.get<Array<string>>(`${environment.backend_url}/user/type`);
  }

  getUsers(query: string) {
    return this.http.get<Array<User>>(`${environment.backend_url}/users?${query}`);
  }

  getUser(userId: number) {
    return this.http.get<User>(`${environment.backend_url}/user?id=${userId}`);
  }

  createUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    type: string,
    departmentId: number
  ) {
    return this.http.post<User>(`${environment.backend_url}/user`, {
      username,
      password,
      firstName,
      lastName,
      type,
      departmentId,
    });
  }

  updateUser(
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    type: string,
    departmentId: number
  ) {
    return this.http.put<User>(`${environment.backend_url}/user`, {
      id,
      username,
      password,
      firstName,
      lastName,
      type,
      departmentId,
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.backend_url}/user?id=${id}`);
  }

  private saveAuthData(token: string, expirationDate: Date, username: string, userType: string, departmentId: number) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expirationDate', expirationDate.toISOString());
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userType', userType);
    if (userType !== 'Admin') {
      sessionStorage.setItem('departmentId', departmentId.toString());
    }
  }

  private clearAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expirationDate');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('departmentId');
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = `${authData.token}`;
      this.username = `${authData.username}`;
      this.setTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      console.log('Expired token');
    }
  }

  private getAuthData() {
    let expirationDate = new Date();
    const dateStr = sessionStorage.getItem('expirationDate');
    if (dateStr) expirationDate = new Date(dateStr);
    return {
      token: localStorage.getItem('token'),
      expirationDate,
      username: localStorage.getItem('username'),
    };
  }

  setSelectedUserId(userId: number) {
    sessionStorage.setItem('selectedUserId', userId.toString());
  }

  getSelectedUserId() {
    return Number(sessionStorage.getItem('selectedUserId'));
  }

  getDepartmentId() {
    return Number(sessionStorage.getItem('departmentId'));
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAuthenticated() {
    return sessionStorage.getItem('token') || '';
  }

  getToken() {
    return (this.token = sessionStorage.getItem('token') || '');
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  getErrorMsg() {
    return this.errorMsg;
  }

  getUserType() {
    return sessionStorage.getItem('userType');
  }

  isAdmin() {
    return this.getUserType() == 'Admin';
  }
}
