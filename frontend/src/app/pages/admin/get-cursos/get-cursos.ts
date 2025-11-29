import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../../services/CursoService';


@Component({
  selector: 'app-get-cursos',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './get-cursos.html',
  styleUrl: './get-cursos.scss',
})
export class GetCursos implements OnInit {

  cursos: any[] = [];



  constructor(private router: Router, private cursoService: CursoService) { }

  activeLink: string = 'gestion-cursos';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  // PROPIEDADES DE USUARIO (Mantenidas si la plantilla HTML las usa)
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';
  setActive(link: string): void {
    this.activeLink = link;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  showAction(action: string): void {
    this.modalTitle = action;
    this.modalMessage = `Has seleccionado: ${action}`;
    this.modalOpen = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.modalOpen = false;
    this.modalTitle = '';
    this.modalMessage = '';
  }

  // Función de logout
  logout(): void {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  openAddCourseModal(): void {
    this.modalTitle = 'AGREGAR CURSO';
    this.modalMessage = 'Introduce los detalles del nuevo curso.';
    this.modalOpen = true;

  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursoService.listarCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        console.log('Cursos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando cursos:', err);
      }
    });
  }

  /*onFileChange(event: any) {
    this.imagen = event.target.files[0];
  }*/

  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput: any;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Portada seleccionada:", file);
    }
  }

  /*crearCurso() {
  if (!this.selectedFile) {
    alert("Debes subir la portada del curso");
    return;
  }

  const curso = {
    titulo: this.titulo,
    descripcion: this.descripcion,
    idCategoria: this.categoriaId,
    idEditor: this.editorId
  };

  const formData = new FormData();
  formData.append('curso', new Blob([JSON.stringify(curso)], { type: 'application/json' }));
  formData.append('imagen', this.selectedFile);

  const token = localStorage.getItem('token') || '';
  if (!token) { alert("No hay token"); return; }

  this.cursoService.agregarCurso(formData, token).subscribe({
    next: resp => {
      console.log("Curso creado:", resp);
      this.cargarCursos();
      this.closeModal();
    },
    error: err => {
      console.error("Error al crear curso:", err);
      alert("Error: " + (err.error?.message || "Verifica los datos y el token"));
    }
  });
}*/



}
