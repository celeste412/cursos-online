import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-profesor',
  imports: [],
  templateUrl: './home-profesor.html',
  styleUrl: './home-profesor.scss',
})
export class HomeProfesor {

  constructor(private router: Router) {}

  // Navegación
  goTo(path: string) {
    this.router.navigate([path]);
  }

  // Datos de ejemplo
  profesorNombre = 'Alonso';
  modulosCreados = 3;
  estudiantesInscritos = 20;

  cursos = [
    { id: 1, nombre: 'Marketing Digital', alumnos: 50, img: '' },
    { id: 2, nombre: 'Fundamentos de Programación', alumnos: 30, img: '' },
    { id: 3, nombre: 'Diseño UX/UI', alumnos: 40, img: 'https://ebac.mx/blog/wp-content/uploads/2022/08/image3-1.jpg' },
  ];
}
