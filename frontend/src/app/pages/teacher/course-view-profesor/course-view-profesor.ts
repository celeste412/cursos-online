import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-view-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './course-view-profesor.html',
  styleUrl: './course-view-profesor.scss',
})
export class CourseViewProfesor implements OnInit {

  courseId!: number;

  modulos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get("id"));
    console.log("Curso seleccionado:", this.courseId);
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
    const data = {
      courseId: this.courseId,
      estructura: this.modulos
    };

    console.log('CURSO GUARDADO:', data);

    alert('Curso guardado correctamente');
  }
}
