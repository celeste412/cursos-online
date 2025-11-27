import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-cursos-select',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-cursos-select.component.html',
  styleUrl: './mis-cursos-select.component.scss'
})
export class MisCursosSelectComponent {

  constructor(private router: Router) { }

  activeLink: string = 'cursos-select';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  setActive(link: string) { this.activeLink = link; }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  logout() {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }

}
