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
    this.cargando = true;
    this.error = '';

    this.teacherService.getMisCursos().subscribe({
      next: (cursos: any[]) => {
        console.log('📊 Cursos recibidos del backend:', cursos);

        // Procesar las URLs de las imágenes
        this.teacherCourses = cursos.map(curso => this.procesarCurso(curso));

        console.log('✅ Cursos procesados:', this.teacherCourses);
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando cursos:', err);
        this.error = 'Error al cargar los cursos. Por favor, intenta nuevamente.';
        this.cargando = false;

        // Para debugging: mostrar datos de ejemplo si hay error
        this.usarDatosDeEjemplo();
      }
    });
  }

  private procesarCurso(curso: any): any {
    return {
      ...curso,
      imagenUrl: this.construirUrlCompleta(curso.imagenUrl),
      estudiantes: curso.students || 0, // Usar students si existe, si no 0
      fechaCreacionFormateada: this.formatearFecha(curso.fechaCreacion)
    };
  }

  private construirUrlCompleta(imagenUrl: string): string {
    console.log('🔧 Procesando URL de imagen:', imagenUrl);

    // Caso 1: Sin imagen o vacío
    if (!imagenUrl || imagenUrl.trim() === '') {
      console.log('⚠️  Sin imagen, usando placeholder');
      return 'https://placehold.co/300x150/d1d5db/4b5563?text=SIN+IMAGEN';
    }

    // Caso 2: Ya es una URL completa (http/https)
    if (imagenUrl.startsWith('http://') || imagenUrl.startsWith('https://')) {
      console.log('✅ Ya es URL completa:', imagenUrl);
      return imagenUrl;
    }

    const baseUrl = 'http://localhost:8080';

    // Caso 3: Ya incluye /uploads/ (pero sin dominio)
    if (imagenUrl.includes('/uploads/')) {
      // Asegurar que empiece con /
      let ruta = imagenUrl.startsWith('/') ? imagenUrl : '/' + imagenUrl;

      // Limpiar posibles duplicados
      ruta = ruta.replace('uploads/uploads/', 'uploads/');

      const urlCompleta = `${baseUrl}${ruta}`;
      console.log('🔗 URL construida (con uploads):', urlCompleta);
      return urlCompleta;
    }

    // Caso 4: Solo el nombre del archivo
    // Limpiar slash inicial si existe
    const nombreLimpio = imagenUrl.startsWith('/') ? imagenUrl.slice(1) : imagenUrl;
    const urlCompleta = `${baseUrl}/uploads/${nombreLimpio}`;

    console.log('📁 URL construida (solo nombre):', urlCompleta);
    return urlCompleta;
  }

  private formatearFecha(fecha: any): string {
    if (!fecha) return 'Fecha no disponible';

    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha no disponible';
      }

      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  }

  // Método para debugging: datos de ejemplo si hay error
  private usarDatosDeEjemplo() {
    console.log('🔄 Usando datos de ejemplo para debugging');

    const cursosEjemplo = [
      {
        id: 1,
        titulo: 'Curso de Ejemplo 1',
        descripcion: 'Descripción del curso de ejemplo',
        imagenUrl: '/uploads/ejemplo1.jpg',
        students: 5,
        fechaCreacion: new Date()
      },
      {
        id: 2,
        titulo: 'Curso de Ejemplo 2',
        descripcion: 'Otra descripción de ejemplo',
        imagenUrl: 'ejemplo2.png',
        students: 3,
        fechaCreacion: new Date()
      }
    ];

    this.teacherCourses = cursosEjemplo.map(curso => this.procesarCurso(curso));
  }


  // 🔥 REDIRECCIÓN AL CONSTRUCTOR (NUEVA RUTA)
  goToBuilder(courseId: number) {
    this.router.navigate(['/teacher/content', courseId]);
  }
}
