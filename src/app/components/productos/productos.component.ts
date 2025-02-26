import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../models/product.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  products: Product[] = []
  filteredProducts: Product[] = []
  searchControl = new FormControl("")

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products
      this.filteredProducts = products
    })

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.filterProducts(searchTerm || "")
    })
  }

  filterProducts(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase()
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.serialNumber.toLowerCase().includes(searchTerm),
    )
  }
}
