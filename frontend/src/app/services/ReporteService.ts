// services/ReporteService.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Progreso promedio por curso
  getProgresoPromedioCursos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/progreso-promedio-cursos`, { headers: this.getHeaders() });
  }

  // Calificaciones promedio por curso
  getCalificacionesPromedio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/calificaciones-promedio`, { headers: this.getHeaders() });
  }

  // Progreso de estudiantes por curso específico
  getProgresoEstudiantesCurso(cursoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/progreso-estudiantes/${cursoId}`, { headers: this.getHeaders() });
  }

  // Lista de cursos para filtros
  getCursos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos`, { headers: this.getHeaders() });
  }
}