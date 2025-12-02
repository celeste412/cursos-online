import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../services/CursoService';

@Component({
  selector: 'app-mis-cursos-select',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-cursos-select.component.html',
  styleUrl: './mis-cursos-select.component.scss'
})
export class MisCursosSelectComponent implements OnInit {

  constructor(private router: Router, private cursoService: CursoService) { }

  cursos: any[] = [];

  activeLink: string = 'cursos-select';
  userMenuOpen: boolean = false;

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

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursoService.listarCursosInscritos().subscribe({
      next: data => this.cursos = data,
      error: err => console.error("Error cargando inscritos:", err)
    });
  }


  getTotalLecciones(curso: any): number {
    return curso.modulos?.reduce(
      (t: number, m: any) => t + (m.lecciones?.length || 0),
      0
    ) || 0;
  }


}
