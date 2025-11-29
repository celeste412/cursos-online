import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UsuarioRequest {
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  password: string;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  nombres = '';
  apellidos = '';
  nombreUsuario = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.error = null;

    const usuario: UsuarioRequest = {
      nombre: this.nombres,
      apellido: this.apellidos,
      nombreUsuario: this.nombreUsuario,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/register', usuario)
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Registro exitoso.');
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.error = 'Error al registrar estudiante';
        }
      });
  }
}
