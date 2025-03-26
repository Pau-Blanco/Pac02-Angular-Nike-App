import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Obtener la información del usuario al cargar el componente
    this.getUserInfo();
  }

  // Método para obtener la información del usuario
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

  // Método para actualizar la información del usuario
  updateUserInfo(): void {
    if (this.isEditing) {
      this.userService.updateUserInfo(this.userInfo).subscribe(
        (response) => {
          console.log('Información actualizada con éxito:', response);
          this.isEditing = false;  // Salir del modo de edición
        },
        (error) => {
          console.error('Error al actualizar la información del usuario', error);
        }
      );
    } else {
      this.isEditing = true;  // Entrar en modo de edición
    }
  }
}
