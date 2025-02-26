import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';
import type { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = []
  private productsSubject = new BehaviorSubject<Product[]>([])

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable()
  }

  addProduct(product: Product): void {
    const newProduct = {
      ...product,
      id: this.products.length + 1,
    }
    this.products.push(newProduct)
    this.productsSubject.next([...this.products])
  }

  updateProduct(product: Product): void {
    const index = this.products.findIndex((p) => p.serialNumber === product.serialNumber)
    if (index !== -1) {
      this.products[index] = { ...product }
      this.productsSubject.next([...this.products])
    }
  }

  getProductBySerialNumber(serialNumber: string): Product | undefined {
    return this.products.find((p) => p.serialNumber === serialNumber)
  }

  isSerialNumberTaken(serialNumber: string, excludeId?: number): boolean {
    return this.products.some((p) => p.serialNumber === serialNumber && p.id !== excludeId)
  }
}
