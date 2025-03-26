import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';  // URL de los endpoints de usuarios

  constructor(private http: HttpClient) { }

  // Obtener información del usuario autenticado
  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // Actualizar información del usuario autenticado
  updateUserInfo(updatedUserData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.put(`${this.apiUrl}/update`, updatedUserData, { headers });
  }
}
