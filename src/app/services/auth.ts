import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  usuario?: string;
  roles?: string[];
}


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/api/auth/login`, // <-- importante: /api/auth/login
      { nombreUsuario: username, password }
    );
  }

  registerEstudiante(nombreUsuario: string, password: string) {
    return this.http.post(
      `${environment.apiUrl}/api/auth/registro-estudiante`, // <-- endpoint de registro
      { nombreUsuario, password }
    );
  }

}
