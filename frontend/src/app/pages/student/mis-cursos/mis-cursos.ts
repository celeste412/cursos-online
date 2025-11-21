import { Component } from '@angular/core';
import { NavStudent } from '../../../components/nav-student/nav-student';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-cursos',
  standalone: true, // <- obligatorio si es standalone
  imports: [NgFor,NavStudent, RouterModule],
  templateUrl: './mis-cursos.html',
  styleUrl: './mis-cursos.scss',
})
export class MisCursos {

  cursos = [
    { id: 1, titulo: 'Curso de HTML', lecciones: 25, duracion: '6 hrs', img: '../../assets/img4.png' },
    { id: 2, titulo: 'Curso de CSS', lecciones: 20, duracion: '5 hrs', img: '../../assets/img4.png' },
    { id: 3, titulo: 'Curso de JavaScript', lecciones: 30, duracion: '8 hrs', img: '../../assets/img4.png' }
  ];

  categorias = ['Programación', 'Diseño Web', 'Marketing', 'Negocios'];
}
