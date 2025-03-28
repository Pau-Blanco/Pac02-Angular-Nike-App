import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.chartService.getCart().subscribe(
      (data) => this.cartItems = data.items,
      (error) => console.error('Error al obtener el carrito', error)
    );
  }

  removeFromCart(product_id: number): void {
    this.chartService.removeFromCart(product_id).subscribe(
      () => this.getCart(),
      (error) => console.error('Error al eliminar producto', error)
    );
  }

  clearCart(): void {
    this.chartService.clearCart().subscribe(
      () => this.cartItems = [],
      (error) => console.error('Error al vaciar el carrito', error)
    );
  }
}
