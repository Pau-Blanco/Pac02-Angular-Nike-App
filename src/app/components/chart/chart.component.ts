import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.chartService.getCart().subscribe(
      (data) => {
        this.cartItems = data.items;
        this.calculateTotal();
      },
      (error) => console.error('Error al obtener el carrito', error)
    );
  }

  removeFromCart(productId: number): void {
    this.chartService.removeFromCart(productId).subscribe(
      () => {
        this.getCart();
      },
      (error) => console.error('Error al eliminar producto', error)
    );
  }

  clearCart(): void {
    this.chartService.clearCart().subscribe(
      () => {
        this.cartItems = [];
        this.totalAmount = 0;
      },
      (error) => console.error('Error al vaciar el carrito', error)
    );
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
