import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-get-usuario',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './get-usuario.html',
  styleUrl: './get-usuario.scss',
})
export class GetUsuario {

  constructor(private router: Router) { }

  // --- PROPIEDADES INICIALIZADAS ---
  activeLink: string = 'gestion-usuarios';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';

  // 🔑 PROPIEDADES CRÍTICAS PARA EL PASSWORD:
  /** * Controla el ícono del ojo. Inicialmente, el password está oculto.
   * Por eso `false`.
   */
  passwordVisible: boolean = false;

  /**
   * Controla el atributo `type` del input (`password` o `text`).
   * Inicialmente debe ser 'password'.
   */
  passwordFieldType: string = 'password';
  // ---------------------------------


  // Navegación
  setActive(link: string) {
    this.activeLink = link;
    this.userMenuOpen = false;
  }

  // Menú de Usuario
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  // Modal de Edición
  showAction(title: string) {
    this.modalTitle = title;
    this.modalOpen = true;
    this.userMenuOpen = false;
  }
  closeModal() {
    this.modalOpen = false;
  }

  // Funcionalidad extra: Mostrar/Ocultar Password
  togglePasswordVisibility() {
    // 1. Alterna el valor booleano
    this.passwordVisible = !this.passwordVisible;
    // 2. Asigna el tipo de campo basado en el booleano
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}