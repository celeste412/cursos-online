import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../services/CursoService';
import { ModuloDTO } from '../../../models/modulo.DTO';
import { MaterialDTO } from '../../../models/Material.dto';
import { LeccionDTO } from '../../../models/leccion.dto';

interface Material {
  nombre: string;
  tipo: 'PDF' | 'VIDEO' | 'POWERPOINT' | 'QUIZ';
}

interface Leccion {
  nombre: string;
  materiales: Material[];
}

interface Modulo {
  nombre: string;
  lecciones: Leccion[];
}

@Component({
  selector: 'app-course-view-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './course-view-profesor.html',
  styleUrl: './course-view-profesor.scss',
})
export class CourseViewProfesor implements OnInit {

  courseId!: number;
  modulos: Modulo[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) { }


  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get("id"));
    console.log("Curso seleccionado:", this.courseId);

    this.cursoService.getCurso(this.courseId).subscribe(curso => {
      if (curso.modulos) {
        this.modulos = curso.modulos.map(m => ({
          nombre: m.titulo,
          lecciones: m.lecciones?.map(l => ({
            nombre: l.titulo,
            materiales: l.materiales?.map(mat => ({
              nombre: mat.url,
              tipo: mat.tipo as 'PDF' | 'VIDEO' | 'POWERPOINT' | 'QUIZ'
            })) || []
          })) || []
        })) || [];
      }
    });
  }

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

  // -------------------------
  // MODULOS
  // -------------------------

  agregarModulo() {
    this.modulos.push({
      nombre: '',
      lecciones: []
    });
  }

  eliminarModulo(index: number) {
    this.modulos.splice(index, 1);
  }

  // -------------------------
  // LECCIONES
  // -------------------------

  agregarLeccion(mi: number) {
    this.modulos[mi].lecciones.push({
      nombre: '',
      materiales: []
    });
  }

  eliminarLeccion(mi: number, li: number) {
    this.modulos[mi].lecciones.splice(li, 1);
  }

  // -------------------------
  // MATERIALES
  // -------------------------

  agregarMaterial(mi: number, li: number) {
    this.modulos[mi].lecciones[li].materiales.push({
      nombre: '',
      tipo: 'PDF'
    });
  }

  eliminarMaterial(mi: number, li: number, ma: number) {
    this.modulos[mi].lecciones[li].materiales.splice(ma, 1);
  }

  // -------------------------
  // GUARDAR CURSO
  // -------------------------

  guardarCurso() {
  const estructuraDTO = this.modulos.map(modulo => ({
    titulo: modulo.nombre,  // solo el nombre
    lecciones: (modulo.lecciones || []).map(leccion => ({
      titulo: leccion.nombre, // solo el nombre
      materiales: (leccion.materiales || []).map(material => ({
        tipo: material.tipo,
        url: material.nombre // aquí pones la URL o nombre del recurso
      }))
    }))
  }));

  this.cursoService.agregarModulo(this.courseId, { modulos: estructuraDTO })
    .subscribe({
      next: res => {
        console.log('Curso guardado:', res);
        alert('Curso guardado correctamente');
      },
      error: err => {
        console.error('Error guardando curso', err);
        alert('No se pudo guardar el curso.');
      }
    });
}


  goToBuilder(id: number) {
    this.router.navigate(['/teacher/mis-cursos', id, 'builder']);
  }

}
