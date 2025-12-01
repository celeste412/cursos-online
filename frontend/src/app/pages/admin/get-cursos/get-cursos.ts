import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../../services/CursoService';
import { UserStateService } from '../../../services/UserStateService';

@Component({
  selector: 'app-get-cursos',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './get-cursos.html',
  styleUrl: './get-cursos.scss',
})
export class GetCursos implements OnInit {

  cursos: any[] = [];
  categorias: any[] = [];
  editores: any[] = [];
  titulo = '';
  descripcion = '';
  categoriaId: number | null = null;
  editorId: number | null = null;
  selectedFile: File | null = null;
  editandoId: number | null = null;

  adminNombreCompleto: string = 'Administrador';

  constructor(
    private router: Router, 
    private cursoService: CursoService,
    private userStateService: UserStateService
  ) { }

  activeLink: string = 'gestion-cursos';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  // PROPIEDADES DE USUARIO
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';

  // CACHE PARA URLs DE IMÁGENES
  private imageUrlCache = new Map<string, string>();

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

  closeModal(): void {
    this.modalOpen = false;
    this.modalTitle = '';
    this.modalMessage = '';
  }

  logout(): void {
    this.userStateService.clearUser();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  openAddCourseModal(): void {
    this.editandoId = null;
    this.resetFormulario();
    this.modalTitle = 'AGREGAR CURSO';
    this.modalMessage = 'Introduce los detalles del nuevo curso.';
    this.modalOpen = true;
  }

  ngOnInit(): void {
    this.cargarNombreUsuario();
    this.cargarCursos();
    this.cargarCategorias();
    this.cargarEditores();
  }

  // CARGAR NOMBRE DESDE SERVICIO COMPARTIDO
  cargarNombreUsuario(): void {
    this.adminNombreCompleto = this.userStateService.getUserName();
  }

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

  // MÉTODO OPTIMIZADO: Obtener URL completa de la imagen CON CACHE
  getImageUrl(imagenUrl: string): string {
    if (!imagenUrl || imagenUrl.trim() === '') {
      return 'https://placehold.co/400x200/90B7D7/FFFFFF/png?text=IMAGEN+CURSO';
    }

    if (this.imageUrlCache.has(imagenUrl)) {
      return this.imageUrlCache.get(imagenUrl)!;
    }

    let finalUrl: string;

    if (imagenUrl.startsWith('http')) {
      finalUrl = imagenUrl;
    } else if (imagenUrl.startsWith('assets/')) {
      finalUrl = imagenUrl;
    } else {
      const baseUrl = 'http://localhost:8080';
      const rutaNormalizada = imagenUrl.startsWith('/') ? imagenUrl : '/' + imagenUrl;
      finalUrl = `${baseUrl}${rutaNormalizada}`;
    }

    this.imageUrlCache.set(imagenUrl, finalUrl);
    return finalUrl;
  }

  clearImageCache() {
    this.imageUrlCache.clear();
  }

  onImageLoad() {
    // Opcional: lógica adicional si es necesaria
  }

  onImageError(event: any, curso: any) {
    console.warn('Error cargando imagen del curso:', curso.titulo, curso.imagenUrl);
    event.target.src = 'https://placehold.co/400x200/90B7D7/FFFFFF/png?text=IMAGEN+NO+DISPONIBLE';
  }

  cargarCursos(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token, no se pueden cargar los cursos.');
      return;
    }

    this.cursoService.listarCursos().subscribe({
      next: (data: any[]) => {
        console.log('📊 CURSOS CARGADOS:', data);
        this.cursos = data;
      },
      error: err => {
        console.error('Error cargando cursos:', err);
      }
    });
  }

  crearCurso() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay token de autenticación. Por favor, inicia sesión again.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Datos del curso:');
    console.log('Título:', this.titulo);
    console.log('Categoría ID:', this.categoriaId);
    console.log('Editor ID:', this.editorId);
    console.log('Archivo:', this.selectedFile?.name);

    if (!this.selectedFile) {
      alert('Debes subir la portada');
      return;
    }
    if (!this.categoriaId) {
      alert('Debes seleccionar categoría');
      return;
    }
    if (!this.editorId) {
      alert('Debes seleccionar editor');
      return;
    }
    if (!this.titulo.trim()) {
      alert('Debes ingresar un título');
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

    this.cursoService.agregarCurso(formData).subscribe({
      next: (response) => {
        console.log('Curso creado exitosamente:', response);
        this.clearImageCache();
        this.cargarCursos();
        this.resetFormulario();
        this.closeModal();
        alert('Curso creado correctamente');
      },
      error: err => {
        console.error('Error completo:', err);
        if (err.status === 403) {
          alert('Error 403 - No tienes permisos para crear cursos. Verifica tu rol de administrador.');
        } else {
          alert('Error al crear curso: ' + (err.error?.message || err.statusText));
        }
      }
    });
  }

  resetFormulario() {
    this.titulo = '';
    this.descripcion = '';
    this.categoriaId = null;
    this.editorId = null;
    this.selectedFile = null;
  }

  cargarCategorias(): void {
    console.log('Iniciando carga de categorías...');
    this.cursoService.listarCategorias().subscribe({
      next: data => {
        console.log('Categorías cargadas en componente:', data);
        this.categorias = data;
      },
      error: err => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cargarEditores(): void {
    console.log('Iniciando carga de editores...');
    this.cursoService.listarEditores().subscribe({
      next: data => {
        console.log('Editores cargados en componente:', data);
        this.editores = data;
      },
      error: err => {
        console.error('Error cargando editores:', err);
      }
    });
  }

  guardarEdicion() {
    if (!this.editandoId) return;

    const cursoEditado = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      idCategoria: this.categoriaId,
      idEditor: this.editorId
    };

    const formData = new FormData();
    formData.append('curso', new Blob([JSON.stringify(cursoEditado)], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.cursoService.editarCurso(this.editandoId, formData).subscribe({
      next: () => {
        this.clearImageCache();
        this.cargarCursos();
        this.resetFormulario();
        this.editandoId = null;
        this.closeModal();
        alert('Curso actualizado correctamente');
      },
      error: err => console.error('Error editando curso:', err)
    });
  }

  eliminarCurso(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      this.cursoService.eliminarCurso(id).subscribe({
        next: (response: any) => {
          console.log('Curso eliminado exitosamente:', response);
          this.clearImageCache();
          this.cargarCursos();
          alert('Curso eliminado correctamente');
        },
        error: (err) => {
          console.error('Error eliminando curso:', err);
          alert('Error al eliminar el curso: ' + (err.error?.message || err.statusText));
        }
      });
    }
  }

  editarCursoModal(curso: any) {
    this.editandoId = curso.id;
    this.titulo = curso.titulo;
    this.descripcion = curso.descripcion;

    this.categoriaId =
      curso.idCategoria ??
      curso.categoriaId ??
      curso.categoria?.id ??
      null;

    this.editorId =
      curso.idEditor ??
      curso.editorId ??
      curso.editor?.id ??
      null;

    this.selectedFile = null;

    this.modalTitle = 'EDITAR CURSO';
    this.modalMessage = 'Modifica los datos del curso.';
    this.modalOpen = true;

    console.log("Modal de edición cargado:", {
      id: this.editandoId,
      titulo: this.titulo,
      categoriaId: this.categoriaId,
      editorId: this.editorId
    });
  }
}