import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userInfo: any = {};  // Variable para almacenar los datos del usuario
  isEditing: boolean = false;  // Controla si el formulario está en modo de edición
  userOrders: any[] = []; // Lista de pedidos del usuario

  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getUserOrders();
  }

  // Obtener la información del usuario
  getUserInfo(): void {
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  // Obtener los pedidos del usuario
  getUserOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders: any[]) => { // Definir explícitamente como un array de `any`
        this.userOrders = orders.filter((order: any) => order.user_id === this.userInfo.id);
      },
      (error) => {
        console.error('Error al obtener los pedidos del usuario', error);
      }
    );
  }

  // Actualizar la información del usuario
  updateUserInfo(): void {
    if (this.isEditing) {
      this.userService.updateUserInfo(this.userInfo).subscribe(
        (response) => {
          console.log('Información actualizada con éxito:', response);
          this.isEditing = false;
        },
        (error) => {
          console.error('Error al actualizar la información del usuario', error);
        }
      );
    } else {
      this.isEditing = true;
    }
  }
}
