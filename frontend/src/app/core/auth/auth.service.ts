import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  register(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    console.log('🔍 DEBUG - Full user object from token:', user);
    const role = user ? user.role : null;
    console.log('🔍 DEBUG - Extracted role:', role);
    return role;
  }

  redirectToDashboard(): void {
    const role = this.getUserRole();
    console.log('🚀 DEBUG - Redirecting with role:', role);

    if (role === 'PASSENGER') {
      console.log('✅ Redirecting to /passenger');
      this.router.navigate(['/passenger']);
    } else if (role === 'DRIVER') {
      console.log('✅ Redirecting to /driver');
      this.router.navigate(['/driver']);
    } else if (role === 'ADMIN') {
      console.log('✅ Redirecting to /admin/dashboard');
      this.router.navigate(['/admin/dashboard']);
    } else {
      console.log('❌ No valid role found, redirecting to login');
      this.router.navigate(['/auth/login']);
    }
  }
}
