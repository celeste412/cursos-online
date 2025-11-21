import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class usuarioService {
  
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/usuarios';

  listarUsuarios(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getUsuarios() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createUsuario(usuario: any) {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

}
