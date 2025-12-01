// reportes-progresos.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ReporteService } from '../../../services/ReporteService';
import { UserStateService } from '../../../services/UserStateService';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes-progresos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reportes-progresos.html',
  styleUrl: './reportes-progresos.scss',
})
export class ReportesProgresos implements OnInit, OnDestroy {
  
  // Datos reales desde la base de datos
  progresoPromedioData: any[] = [];
  calificacionesPromedioData: any[] = [];
  progresoEstudiantesData: any[] = [];
  
  // Filtros
  cursos: any[] = [];
  cursoSeleccionado: number | null = null;
  cursoSeleccionadoCalificaciones: number | null = null;
  cursoSeleccionadoEstudiantes: number | null = null;

  // Charts
  private chartProgreso: any;
  private chartCalificaciones: any;
  private chartProgresoEstudiantes: any;

  adminNombreCompleto: string = 'Administrador';

  constructor(
    private router: Router,
    private userStateService: UserStateService,
    private reporteService: ReporteService
  ) { }

  activeLink: string = 'reportes';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  
  // PROPIEDADES DE USUARIO
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';

  ngOnInit(): void {
    this.cargarNombreUsuario();
    this.cargarDatosReportes();
    this.cargarCursosParaFiltros();
  }

  ngOnDestroy(): void {
    // Limpiar charts
    if (this.chartProgreso) this.chartProgreso.destroy();
    if (this.chartCalificaciones) this.chartCalificaciones.destroy();
    if (this.chartProgresoEstudiantes) this.chartProgresoEstudiantes.destroy();
  }

  cargarNombreUsuario(): void {
    this.adminNombreCompleto = this.userStateService.getUserName();
  }

  cargarDatosReportes(): void {
    this.cargarProgresoPromedio();
    this.cargarCalificacionesPromedio();
  }

  cargarCursosParaFiltros(): void {
    this.reporteService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        console.log('Cursos cargados para filtros:', data);
      },
      error: (err) => {
        console.error('Error cargando cursos:', err);
      }
    });
  }

  // GRÁFICO 1: Progreso promedio por curso
  cargarProgresoPromedio(): void {
    this.reporteService.getProgresoPromedioCursos().subscribe({
      next: (data) => {
        this.progresoPromedioData = data;
        this.crearChartProgresoPromedio();
      },
      error: (err) => {
        console.error('Error cargando progreso promedio:', err);
        // Datos de ejemplo si falla
        this.progresoPromedioData = [
          { cursoNombre: 'Curso A', progresoPromedio: 65 },
          { cursoNombre: 'Curso B', progresoPromedio: 80 },
          { cursoNombre: 'Curso C', progresoPromedio: 45 }
        ];
        this.crearChartProgresoPromedio();
      }
    });
  }

  // GRÁFICO 2: Calificaciones promedio
  cargarCalificacionesPromedio(): void {
    this.reporteService.getCalificacionesPromedio().subscribe({
      next: (data) => {
        this.calificacionesPromedioData = data;
        this.crearChartCalificacionesPromedio();
      },
      error: (err) => {
        console.error('Error cargando calificaciones:', err);
        // Datos de ejemplo
        this.calificacionesPromedioData = [
          { cursoNombre: 'Curso A', calificacionPromedio: 7.5 },
          { cursoNombre: 'Curso B', calificacionPromedio: 8.2 },
          { cursoNombre: 'Curso C', calificacionPromedio: 6.8 }
        ];
        this.crearChartCalificacionesPromedio();
      }
    });
  }

  // GRÁFICO 3: Progreso de estudiantes por curso
  cargarProgresoEstudiantes(): void {
    if (!this.cursoSeleccionadoEstudiantes) return;

    this.reporteService.getProgresoEstudiantesCurso(this.cursoSeleccionadoEstudiantes).subscribe({
      next: (data) => {
        this.progresoEstudiantesData = data;
        this.crearChartProgresoEstudiantes();
      },
      error: (err) => {
        console.error('Error cargando progreso estudiantes:', err);
        // Datos de ejemplo
        this.progresoEstudiantesData = [
          { estudianteNombre: 'Juan Pérez', progreso: 75 },
          { estudianteNombre: 'María García', progreso: 90 },
          { estudianteNombre: 'Carlos López', progreso: 60 }
        ];
        this.crearChartProgresoEstudiantes();
      }
    });
  }

  // CREAR GRÁFICOS CON CHART.JS

  crearChartProgresoPromedio(): void {
    const ctx = document.getElementById('chartProgreso') as HTMLCanvasElement;
    
    if (this.chartProgreso) {
      this.chartProgreso.destroy();
    }

    const labels = this.progresoPromedioData.map(item => item.cursoNombre);
    const data = this.progresoPromedioData.map(item => item.progresoPromedio);

    this.chartProgreso = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Progreso Promedio (%)',
          data: data,
          backgroundColor: '#9B59B6',
          borderColor: '#8E44AD',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Progreso Promedio por Curso'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Porcentaje (%)'
            }
          }
        }
      }
    });
  }

  crearChartCalificacionesPromedio(): void {
    const ctx = document.getElementById('chartCalificaciones') as HTMLCanvasElement;
    
    if (this.chartCalificaciones) {
      this.chartCalificaciones.destroy();
    }

    const labels = this.calificacionesPromedioData.map(item => item.cursoNombre);
    const data = this.calificacionesPromedioData.map(item => item.calificacionPromedio);

    this.chartCalificaciones = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Calificación Promedio',
          data: data,
          backgroundColor: 'rgba(72, 201, 176, 0.2)',
          borderColor: '#48C9B0',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Calificaciones Promedio por Curso'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            title: {
              display: true,
              text: 'Calificación (0-10)'
            }
          }
        }
      }
    });
  }

  crearChartProgresoEstudiantes(): void {
    const ctx = document.getElementById('chartProgresoEstudiantes') as HTMLCanvasElement;
    
    if (this.chartProgresoEstudiantes) {
      this.chartProgresoEstudiantes.destroy();
    }

    const labels = this.progresoEstudiantesData.map(item => item.estudianteNombre);
    const data = this.progresoEstudiantesData.map(item => item.progreso);

    this.chartProgresoEstudiantes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Progreso (%)',
          data: data,
          backgroundColor: '#10B981',
          borderColor: '#0F9D58',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Progreso de Estudiantes'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Porcentaje (%)'
            }
          }
        }
      }
    });
  }

  // MANEJADORES DE FILTROS
  onFiltroEstudiantesChange(): void {
    this.cargarProgresoEstudiantes();
  }

  // MÉTODOS EXISTENTES
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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  openAddCourseModal(): void {
    this.modalTitle = 'AGREGAR CURSO';
    this.modalMessage = 'Introduce los detalles del nuevo curso.';
    this.modalOpen = true;
  }
}