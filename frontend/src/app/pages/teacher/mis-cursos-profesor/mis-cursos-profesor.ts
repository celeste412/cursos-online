import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { Curso, TeacherService } from '../../../services/TeacherService';

interface Material {
  id?: number;
  nombre: string;
  tipo: 'PDF' | 'VIDEO' | 'QUIZ';
}

interface Leccion {
  id?: number;
  titulo: string;
  materiales?: Material[];
}

interface Modulo {
  id?: number;
  titulo: string;
  lecciones?: Leccion[];
}

@Component({
  selector: 'app-mis-cursos-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-cursos-profesor.html',
  styleUrl: './mis-cursos-profesor.scss',
})
export class MisCursosProfesor implements OnInit {

  teacherCourses: Curso[] = [];
  cargando: boolean = true;
  error: string = '';

  cursoId!: number;
  // curso seleccionado
  modulos: any[] = [];
  nuevoModulo: any = { titulo: '' };
  nuevaLeccion: any = { titulo: '' };
  nuevoMaterial: any = { nombre: '', tipo: 'PDF' };

  constructor(private router: Router, private teacherService: TeacherService) { }

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

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.teacherService.getMisCursos().subscribe({
      next: cursos => this.teacherCourses = cursos,
      error: err => console.error('Error cargando cursos', err)
    });
  }


  // 🔥 REDIRECCIÓN AL CONSTRUCTOR (NUEVA RUTA)
  goToBuilder(courseId: number) {
    this.router.navigate(['/teacher/content', courseId]);
  }
}
