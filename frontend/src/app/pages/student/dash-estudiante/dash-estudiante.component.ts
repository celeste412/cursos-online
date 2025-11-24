import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dash-estudiante',
  imports: [CommonModule, RouterModule],
  templateUrl: './dash-estudiante.component.html',
  styleUrls: ['./dash-estudiante.component.scss']
})
export class DashEstudianteComponent {

  constructor(private router: Router) { }

  handleLogout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  activeLink: string = 'home';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  progress = [
    { icon: 'bi bi-book', value: '8', label: 'Cursos Completados', percentage: '80%', color: '#FF7E00', type: '' },
    { icon: 'bi bi-bar-chart', value: '5', label: 'Proyectos', percentage: '50%', color: '#10B981', type: '' },
    { icon: 'bi bi-award', value: '12', label: 'Logros', percentage: '60%', color: '#F59E0B', type: '' }
  ];

  courses = [
    { title: 'Angular Avanzado', start: '01/12/2025', students: 120, img: 'https://placehold.co/300x150', icon: 'bi bi-laptop' },
    { title: 'React.js Moderno', start: '10/12/2025', students: 95, img: 'https://placehold.co/300x150', icon: 'bi bi-code-slash' },
    { title: 'Node.js Backend', start: '15/12/2025', students: 75, img: 'https://placehold.co/300x150', icon: 'bi bi-server' }
  ];

  activities = [
    { icon: 'bi bi-pencil', text: 'Completa tu perfil', color: '#FF7E00', skip: 'Saltar Perfil', go: 'Editar Perfil' },
    { icon: 'bi bi-calendar-check', text: 'Revisa tus próximos cursos', color: '#10B981', skip: 'Ignorar', go: 'Ver Cursos' }
  ];

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
