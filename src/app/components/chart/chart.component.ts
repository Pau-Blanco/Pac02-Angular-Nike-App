import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  paymentMethod: string = ''; // Propiedad para el método de pago
  shippingAddress: string = ''; // Propiedad para la dirección de envío
  cartId: number | null = null; // Propiedad para el ID del carrito

  constructor(private chartService: ChartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.chartService.getCart().subscribe(
      (data) => {
        this.cartItems = data.items;
        this.cartId = data.id; // Asegúrate de que el ID del carrito se obtenga correctamente
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

  placeOrder(): void {
    if (!this.paymentMethod || !this.shippingAddress) {
      alert('Por favor, completa el método de pago y la dirección de envío.');
      return;
    }
  
    const orderData = {
      cartId: this.cartId,
      paymentMethod: this.paymentMethod,
      shippingAddress: this.shippingAddress
    };
  
    this.orderService.placeOrder(orderData).subscribe(
      (response) => {
        alert('Pedido realizado con éxito.');
        
        // Vaciar el carrito solo si la compra se realizó correctamente
        this.clearCart();
      },
      (error) => {
        console.error('Error al realizar el pedido', error);
        alert('Hubo un problema con tu pedido. Inténtalo de nuevo.');
      }
    );
  }
  
}