import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class usuarioService {

  private http = inject(HttpClient);
  private apiAuth = environment.apiUrl + '/api/auth';
  private apiUrl = environment.apiUrl + '/api/usuarios';



  private getHeaders(token: string) {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  listarUsuarios(token: string): Observable<any[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>('http://localhost:8080/api/usuarios/listar', { headers });
  }



  getPerfilAdmin(token: string) {
    return this.http.get(
      `${this.apiAuth}/me`,   // <-- ESTE DEBE EXISTIR EN TU BACKEND
      { headers: this.getHeaders(token) }
    );
  }

  // Registro público (estudiante)
  registerEstudiante(usuario: any) {
    return this.http.post(`${this.apiAuth}/register`, usuario);
  }

  // Crear usuario siendo administrador
  crearUsuarioAdmin(usuario: any, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post('http://localhost:8080/api/auth/crear', usuario, { headers });
  }

  editarUsuario(id: number, data: any) {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/editar/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { headers });
  }



}





