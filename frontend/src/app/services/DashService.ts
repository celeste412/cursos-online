import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CursoAvance, UsuarioReciente } from '../models/dashboard';


export interface DashboardTotales {
  totalCursos: number;
  totalEstudiantes: number;
  totalEditores: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashService {

  private apiUrl = environment.apiUrl + '/api/dashboard';

  constructor(private http: HttpClient) { }

  obtenerTotales(): Observable<DashboardTotales> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DashboardTotales>(`${this.apiUrl}/totales`, { headers });
  }


  obtenerUltimosCursos(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/ultimos-cursos`, { headers });
  }

  obtenerUltimosUsuarios(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/ultimos-usuarios`, { headers });
  }


  obtenerAvanceCursos(): Observable<CursoAvance[]> {
    return this.http.get<CursoAvance[]>(`${this.apiUrl}/avance-cursos`);
  }

  obtenerUsuariosRecientes(limit: number = 5): Observable<UsuarioReciente[]> {
    return this.http.get<UsuarioReciente[]>(`${this.apiUrl}/usuarios-recientes?limit=${limit}`);
  }

}
