import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) { }

  addToCart(product_id: number, quantity: number): Observable<any> {
    if (!product_id || !quantity || quantity <= 0) {
      console.error('Datos del producto o cantidad inválidos.');
      return new Observable(); // Evita hacer la petición si los datos no son válidos
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = { product_id, quantity };

    console.log('Enviando datos al carrito:', body); // Asegúrate de que el cuerpo es correcto

    return this.http.post(`${this.apiUrl}/add`, body, { headers });
  }


  getCart(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.apiUrl, { headers });
  }

  removeFromCart(productId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.apiUrl}/remove/${productId}`, { headers });
  }

  clearCart(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.apiUrl}/clear`, { headers });
  }
}
