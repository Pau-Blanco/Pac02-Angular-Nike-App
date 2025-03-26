import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Product } from '../models/product.interface';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Obtener un producto por serial number
  getProductBySerialNumber(serial_number: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}?serial_number=${serial_number}`);
  }

  // Agregar un nuevo producto
  addProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Asegúrate de usar la clave correcta
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, productData, { headers });
  }

  // Actualizar producto
  updateProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<Product>(`${this.apiUrl}/${product.serial_number}`, product, { headers });
  }

  // Eliminar un producto
  deleteProduct(serial_number: string): Observable<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No hay token, acceso denegado.');
      return new Observable(); // Evita hacer la petición si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Cambia la URL para que se use el serial_number en la ruta
    return this.http.delete<void>(`${this.apiUrl}/${serial_number}`, { headers });
  }

}
