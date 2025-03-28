import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ChartService } from '../../services/chart.service'; // Importar el servicio ChartService
import type { Product } from '../../models/product.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  products: Product[] = []
  filteredProducts: Product[] = []
  searchControl = new FormControl("")

  constructor(
    private productService: ProductService,
    private chartService: ChartService // Inyectar el servicio ChartService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;

      // Inicializar la cantidad en 1 si no está definida
      this.products.forEach(product => {
        if (!product.quantity) {
          product.quantity = 1; // Valor por defecto
        }
      });
    });

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.filterProducts(searchTerm || "");
    });
  }

  filterProducts(searchTerm: string): void {
    searchTerm = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.serial_number.toLowerCase().includes(searchTerm),
    );
  }

  // Método para añadir producto al carrito
  addToCart(product: Product): void {
    if (product.quantity && product.quantity > 0 && product.quantity <= product.in_stock) {
      console.log('Producto ID:', product.id);
      console.log('Cantidad:', product.quantity);

      // Asegurarse de que el producto y la cantidad son correctos
      this.chartService.addToCart(product.id, product.quantity).subscribe(response => {
        console.log('Producto añadido al carrito', response);
      }, error => {
        console.error('Error al añadir al carrito', error);
      });
    } else {
      console.error('Cantidad inválida');
    }
  }
}
