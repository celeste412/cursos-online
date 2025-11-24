import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes-progresos',
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-progresos.html',
  styleUrl: './reportes-progresos.scss',
})
export class ReportesProgresos {

  constructor(private router: Router) { }

  activeLink: string = 'reportes';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  // PROPIEDADES DE USUARIO (Mantenidas si la plantilla HTML las usa)
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';
  setActive(link: string): void {
    this.activeLink = link;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  showAction(action: string): void {
    this.modalTitle = action;
    this.modalMessage = `Has seleccionado: ${action}`;
    this.modalOpen = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.modalOpen = false;
    this.modalTitle = '';
    this.modalMessage = '';
  }

  // Función de logout
  logout(): void {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  openAddCourseModal(): void {
    this.modalTitle = 'AGREGAR CURSO';
    this.modalMessage = 'Introduce los detalles del nuevo curso.';
    this.modalOpen = true;

  }
}
