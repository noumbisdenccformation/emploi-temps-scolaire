import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    // Mode simulation si backend indisponible
    if (!navigator.onLine || window.location.hostname === 'localhost') {
      return new Observable(observer => {
        setTimeout(() => {
          observer.next({ message: 'Inscription réussie (mode simulation)' });
          observer.complete();
        }, 1000);
      });
    }
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    // Mode simulation si backend indisponible
    if (!navigator.onLine || window.location.hostname === 'localhost') {
      return new Observable(observer => {
        setTimeout(() => {
          const response = {
            token: 'simulation-token-' + Date.now(),
            user: { email: credentials.email, firstName: 'Utilisateur' }
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          observer.next(response);
          observer.complete();
        }, 1000);
      });
    }
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}