import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-mis-cursos-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-cursos-profesor.html',
  styleUrl: './mis-cursos-profesor.scss',
})
export class MisCursosProfesor {

  constructor(private router: Router) { }

  activeLink: string = 'courses';
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

  teacherCourses = [
    { id: 1, title: 'Marketing Digital', img: '/assets/courses/marketing.jpg', students: 82 },
    { id: 2, title: 'Gestión de Redes Sociales', img: '/assets/courses/social.jpg', students: 152 },
    { id: 3, title: 'SEO Profesional', img: '/assets/courses/seo.jpg', students: 60 }
  ]

  // 🔥 REDIRECCIÓN AL CONSTRUCTOR (NUEVA RUTA)
  goToBuilder(courseId: number) {
    this.router.navigate(['/teacher/content', courseId]);
  }
}
