import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated: boolean = false;  // Variable para comprobar si el usuario está autenticado

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Comprobar el estado de autenticación al inicio
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  onLogout(): void {
    // Llamar al servicio de logout
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirigir al login después de cerrar sesión
  }
}
