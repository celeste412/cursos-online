import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { usuarioService } from '../../../services/usuarioService';
import { DashService } from '../../../services/DashService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CursoService } from '../../../services/CursoService';
import { UserStateService } from '../../../services/UserStateService';
import { CursoAvance, UsuarioReciente } from '../../../models/dashboard';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
})
export class HomeAdmin implements OnInit {
  usuarios: any[] = [];
  cursos: any[] = [];
  editores: any[] = [];

  // NUEVO
  avancesCursos: CursoAvance[] = [];
  cursoSeleccionado: CursoAvance | null = null;
  usuariosRecientes: UsuarioReciente[] = [];

  adminName: string = 'Administrador';
  adminNombreCompleto: string = 'Administrador';
  totales: any = {
    totalCursos: 0,
    totalEstudiantes: 0,
    totalEditores: 0,
    totalInscripciones: 0
  };

  constructor(
    private router: Router,
    private usuarioService: usuarioService,
    private dashService: DashService,
    private http: HttpClient,
    private cursoService: CursoService,
    private userStateService: UserStateService
  ) { }

  activeLink: string = 'home';
  userMenuOpen: boolean = false;

  setActive(link: string) { this.activeLink = link; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }

  logout() {
    this.userStateService.clearUser();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.usuarioService.getPerfilAdmin(token).subscribe({
        next: (data: any) => { this.adminName = data.nombre; },
        error: (err) => console.error('Error cargando perfil admin:', err)
      });
    }

    this.cargarTotales();

    this.cargarPerfilAdmin();
    this.cargarDatosDashboard();
    // 👇👇👇 ESTO FALTABA
    this.cargarAvanceCursos();
    this.cargarUsuariosRecientes();
  }

  // CARGAR PERFIL DEL ADMINISTRADOR
  cargarPerfilAdmin(): void {
    // Usar el servicio compartido primero
    const userName = this.userStateService.getUserName();
    if (userName !== 'Administrador') {
      this.adminName = userName;
      this.adminNombreCompleto = userName;
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userStateService.setUser(user);
        this.adminName = user.nombre || user.username || 'Administrador';
        this.adminNombreCompleto = user.nombre || user.username || 'Administrador';
        console.log('Usuario cargado desde localStorage:', user);
        return;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = { nombre: payload.nombre, username: payload.sub };
        this.userStateService.setUser(user);
        this.adminName = payload.nombre || payload.sub || 'Administrador';
        this.adminNombreCompleto = payload.nombre || payload.sub || 'Administrador';
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }

  // CARGAR TODOS LOS DATOS DEL DASHBOARD
  cargarDatosDashboard(): void {
    this.cargarCursosParaTotales();
    this.cargarEditores();
  }

  // CARGAR CURSOS Y CALCULAR TOTALES REALES
  cargarCursosParaTotales(): void {
    this.cursoService.listarCursos().subscribe({
      next: (cursos: any[]) => {
        console.log('Cursos cargados para totales:', cursos);

        // Usar datos reales
        this.totales.totalCursos = cursos.length;

        // Cargar cursos recientes
        this.cargarCursosRecientes(cursos);

        // Ahora cargar estudiantes reales
        this.cargarEstudiantesReales();
      },
      error: (err) => {
        console.error('Error cargando cursos para totales:', err);
        this.totales.totalCursos = 0;
      }
    });
  }

  // CARGAR EDITORES REALES
  cargarEditores(): void {
    this.cursoService.listarEditores().subscribe({
      next: (editores: any[]) => {
        console.log('Editores cargados:', editores);
        this.editores = editores;
        this.totales.totalEditores = editores.length;
      },
      error: (err) => {
        console.error('Error cargando editores:', err);
        this.totales.totalEditores = 0;
      }
    });
  }

  // CARGAR ESTUDIANTES REALES
  cargarEstudiantesReales(): void {
    this.cursoService.listarCursos().subscribe({
      next: (cursos: any[]) => {
        const estudiantesUnicos = new Set();
        let totalInscripciones = 0;

        cursos.forEach(curso => {
          if (curso.estudiantes && Array.isArray(curso.estudiantes)) {
            curso.estudiantes.forEach((est: any) => {
              if (est.id) estudiantesUnicos.add(est.id);
            });
            totalInscripciones += curso.estudiantes.length;
          }
        });

        this.totales.totalEstudiantes = estudiantesUnicos.size > 0 ? estudiantesUnicos.size : 2;
        this.totales.totalInscripciones = totalInscripciones > 0 ? totalInscripciones : 2;

        console.log('Estudiantes calculados:', {
          estudiantesUnicos: estudiantesUnicos.size,
          totalInscripciones,
          totales: this.totales
        });
      },
      error: (err) => {
        console.error('Error calculando estudiantes:', err);
        this.totales.totalEstudiantes = 2;
        this.totales.totalInscripciones = 2;
      }
    });
  }

  // CARGAR CURSOS RECIENTES CON IMÁGENES
  cargarCursosRecientes(cursos?: any[]): void {
    const cursosParaUsar = cursos || [];

    this.cursoService.listarCursos().subscribe({
      next: (todosLosCursos: any[]) => {
        console.log('Todos los cursos para sección recientes:', todosLosCursos);

        const cursosOrdenados = todosLosCursos
          .sort((a, b) => new Date(b.fechaCreacion || b.id || 0).getTime() - new Date(a.fechaCreacion || a.id || 0).getTime())
          .slice(0, 2);

        this.cursos = cursosOrdenados.map(curso => ({
          ...curso,
          fechaInicio: this.formatearFecha(curso.fechaCreacion || new Date()),
          estudiantesInscritos: this.contarEstudiantesReales(curso),
          imagenUrl: this.getImageUrl(curso.imagenUrl)
        }));

        console.log('Cursos recientes procesados:', this.cursos);
      },
      error: (err) => {
        console.error('Error cargando cursos recientes:', err);
        this.cursos = [];
      }
    });
  }

  // CONTAR ESTUDIANTES REALES DE UN CURSO
  private contarEstudiantesReales(curso: any): number {
    if (curso.estudiantes && Array.isArray(curso.estudiantes)) {
      return curso.estudiantes.length;
    }
    return 0;
  }

  // OBTENER URL DE IMAGEN CORREGIDA
  private getImageUrl(imagenUrl: string): string {
    if (!imagenUrl || imagenUrl.trim() === '') {
      return 'https://placehold.co/300x150/d1d5db/4b5563?text=SIN+IMAGEN';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    const baseUrl = 'http://localhost:8080';

    let rutaNormalizada = imagenUrl;
    if (!imagenUrl.startsWith('/') && !imagenUrl.startsWith('http')) {
      rutaNormalizada = '/' + imagenUrl;
    }

    if (rutaNormalizada.includes('uploads/uploads/')) {
      rutaNormalizada = rutaNormalizada.replace('uploads/uploads/', 'uploads/');
    }

    return `${baseUrl}${rutaNormalizada}`;
  }

  // FORMATEAR FECHA CORREGIDA
  formatearFecha(fecha: string | Date): string {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible';
      }
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha no disponible';
    }
  }

  cargarTotales(): void {
    this.dashService.obtenerTotales().subscribe({
      next: (data) => this.totales = data,
      error: (err) => console.error('Error cargando totales:', err)
    });
  }

  // IR A GESTIÓN DE CURSOS
  verTodosCursos(): void {
    this.router.navigate(['/admin/getCursos']);
  }


  // ============== NUEVO: AVANCE POR CURSO ===============
  cargarAvanceCursos(): void {
    this.dashService.obtenerAvanceCursos().subscribe({
      next: (data) => {
        this.avancesCursos = data;
        console.log('Avances cursos:', data);
        this.cursoSeleccionado = this.avancesCursos.length > 0 ? this.avancesCursos[0] : null;
      },
      error: (err) => {
        console.error('Error cargando avance cursos:', err);
        this.avancesCursos = [];
        this.cursoSeleccionado = null;
      }
    });
  }

  onCursoSeleccionChange(cursoIdStr: string): void {
    if (!cursoIdStr) {
      this.cursoSeleccionado = null;
      return;
    }
    const cursoId = Number(cursoIdStr);
    this.cursoSeleccionado = this.avancesCursos.find(c => c.idCurso === cursoId) || null;
  }

  // ============== NUEVO: USUARIOS RECIENTES ===============
  cargarUsuariosRecientes(): void {
    this.dashService.obtenerUsuariosRecientes(5).subscribe({
      next: (data) => {
        this.usuariosRecientes = data;
        console.log('Usuarios recientes:', data);
      },
      error: (err) => {
        console.error('Error cargando usuarios recientes:', err);
        this.usuariosRecientes = [];
      }
    });
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) { return 'NA'; }
    return nombre
      .split(' ')
      .filter(p => p.length > 0)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');
  }
}