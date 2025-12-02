import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../services/CursoService';

@Component({
  selector: 'app-mis-cursos',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-cursos.html',
  styleUrl: './mis-cursos.scss',
})
export class MisCursos implements OnInit {
  cursos: any[] = [];

  constructor(private router: Router, private cursoService: CursoService) { }

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

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursoService.listarCursosPublicos().subscribe({
      next: data => this.cursos = data,
      error: err => console.error("Error cargando catálogo:", err)
    });
  }

  getTotalLecciones(curso: any): number {
    if (!curso.modulos) return 0;

    return curso.modulos.reduce((total: number, modulo: any) => {
      return total + (modulo.lecciones?.length || 0);
    }, 0);
  }

}
