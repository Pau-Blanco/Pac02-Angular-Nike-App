import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if(!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/place`, orderData, {headers});
  }

  getOrders(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if(!token) {
      console.error('No hay token, acceso denegado');
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.apiUrl, {headers});
  }

  getOrderById(orderId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if(!token) {
      console.error('No hay token, acceso denegado')
      return new Observable();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/${orderId}`, {headers})
  }
}
