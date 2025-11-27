import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface LeccionProgress {
  nombre: string;
  completo: boolean;
}

interface ModuloProgress {
  nombre: string;
  progreso: number;
  lecciones: LeccionProgress[];
}

interface CursoProgress {
  curso: string;
  progreso: number;
  modulos: ModuloProgress[];
}


@Component({
  selector: 'app-progreso-estudiante',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './progreso-estudiante.html',
  styleUrl: './progreso-estudiante.scss',
})
export class ProgresoEstudiante {
  constructor(private router: Router) { }

  activeLink: string = 'students';
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
  cursos = [
    { id: 1, name: "Marketing Digital" },
    { id: 2, name: "SEO Avanzado" },
    { id: 3, name: "Community Manager" }
  ];

  alumnos = [
    { id: 1, name: "Ana Torres" },
    { id: 2, name: "Carlos Martínez" },
    { id: 3, name: "Luis Pérez" }
  ];

  selectedCurso: any = null;
  selectedAlumno: any = null;

  // 🔥 AHORA TIPADO
  progresoData: CursoProgress | null = null;

  // 🔥 MOCK TIPADO CORRECTAMENTE
  progresoMock: Record<number, Record<number, CursoProgress>> = {
    1: {
      1: {
        curso: "Marketing Digital",
        progreso: 68,
        modulos: [
          {
            nombre: "Módulo 1: Introducción",
            progreso: 100,
            lecciones: [
              { nombre: "Lección 1.1", completo: true },
              { nombre: "Lección 1.2", completo: true }
            ]
          },
          {
            nombre: "Módulo 2: Estrategias",
            progreso: 40,
            lecciones: [
              { nombre: "Lección 2.1", completo: true },
              { nombre: "Lección 2.2", completo: false },
              { nombre: "Lección 2.3", completo: false }
            ]
          }
        ]
      }
    }
  };

  // 🔥 CONSULTA DE PROGRESO (sin TS7053)
  cargarProgreso() {
    if (!this.selectedAlumno || !this.selectedCurso) return;

    const curso = this.selectedCurso.id;
    const alumno = this.selectedAlumno.id;

    this.progresoData =
      this.progresoMock[curso]?.[alumno] ?? null;
  }
}
