import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './home-profesor.html',
  styleUrl: './home-profesor.scss',
})
export class HomeProfesor {

  constructor(private router: Router) { }

  teacherCourses = [
    {
      title: "Marketing Digital Avanzado",
      img: "/assets/courses/marketing.jpg",
      students: 82,
      updated: "Hace 3 días"
    },
    {
      title: "Gestión de Redes Sociales",
      img: "/assets/courses/social.jpg",
      students: 152,
      updated: "Hace 1 semana"
    },
    {
      title: "SEO Profesional",
      img: "/assets/courses/seo.jpg",
      students: 60,
      updated: "Ayer"
    }
  ];


  activeLink: string = 'home';
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
