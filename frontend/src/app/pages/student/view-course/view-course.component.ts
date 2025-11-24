import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-course',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.scss'
})
export class ViewCourseComponent {
  constructor(private router: Router) { }

  activeLink: string = 'cursos';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  setActive(link: string) { this.activeLink = link; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  showAction(action: string) {
    this.modalTitle = action;
    this.modalMessage = `Has seleccionado: ${action}`;
    this.modalOpen = true;
  }
  closeModal() { this.modalOpen = false; }
  // Cerrar sesión
  logout() {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token'); // o sessionStorage
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }
}
