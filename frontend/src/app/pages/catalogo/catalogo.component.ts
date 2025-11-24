import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-catalogo',
   standalone: true,            // si estás usando standalone
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  searchTerm: string = '';
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<Curso[]>('http://localhost:8080/api/cursos/public')
      .subscribe({
        next: data => {
          this.cursos = data;
          this.cursosFiltrados = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'No se pudieron cargar los cursos';
          this.loading = false;
        }
      });
  }
  filtrarCursos() {
    const term = this.searchTerm.toLowerCase();
    this.cursosFiltrados = this.cursos.filter(curso =>
      curso.titulo.toLowerCase().includes(term) ||
      curso.descripcion.toLowerCase().includes(term)
    );
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

  inscribir(id: number) {
    alert(`Inscribiendo al curso ${id}`);
    // Aquí puedes agregar la lógica real de inscripción
  }
}


