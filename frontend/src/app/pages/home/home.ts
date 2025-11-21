import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [RouterLink, CommonModule]
})
export class HomePrincipal implements OnInit {
  cursos: Curso[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<Curso[]>('http://localhost:8080/api/cursos/public')
      .subscribe({
        next: data => {
          this.cursos = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'No se pudieron cargar los cursos';
          this.loading = false;
        }
      });
  }

  verCurso(id: number) {
    const token = localStorage.getItem('token'); // o donde guardes el JWT
    if (!token) {
      alert('Debes iniciar sesión o registrarte para ver este curso');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/student/course', id]);
    }
  }
}
