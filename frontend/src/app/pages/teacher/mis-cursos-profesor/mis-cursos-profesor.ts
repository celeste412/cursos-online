import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-mis-cursos-profesor',
  imports: [NgFor],
  templateUrl: './mis-cursos-profesor.html',
  styleUrl: './mis-cursos-profesor.scss',
})
export class MisCursosProfesor {

  constructor(private router: Router) { }

  cursos = [
    {
      id: 1,
      titulo: "Marketing Digital",
      lecciones: 25,
      duracion: "6 hrs",
      img: "https://img.freepik.com/free-photo/digital-marketing-graphic-design_53876-120072.jpg"
    },
    {
      id: 2,
      titulo: "Fundamentos de Programación",
      lecciones: 30,
      duracion: "8 hrs",
      img: "https://img.freepik.com/free-photo/programming-background-collage_23-2149901784.jpg"
    },
    {
      id: 3,
      titulo: "Diseño UX/UI",
      lecciones: 18,
      duracion: "5 hrs",
      img: "https://th.bing.com/th/id/OIP.RUkED6YM1_G1hBPBhIaX8QHaEv?w=295&h=189"
    }

  ];

  // Navegar a detalle del curso
  verCurso(id: number) {
    this.router.navigate([`/teacher/curso/${id}`]);
  }
}
