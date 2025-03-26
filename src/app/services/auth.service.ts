import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          this.setAuthToken(response.token);
          this.setUserRole(response.user.role); // Guardamos el rol
          console.log('Token guardado:', response.token); // Verifica en la consola
        }
      })
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Guarda el token en localStorage
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Obtiene el token de localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Guarda el rol del usuario en localStorage
  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  // Obtiene el rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Verifica si el usuario es admin
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // Cierra sesión eliminando el token y rol
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

}
