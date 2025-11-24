import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-cursos',
  imports: [NgIf, NgFor],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class Cursos {

  showModal = false;
  cursos = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    titulo: 'Curso de HTML',
    lecciones: 25,
    duracion: '6 hrs',
    img: '../../assets/img4.png'
  }));

  constructor(private router: Router) {}

  openModal() {
    this.showModal = true;
  }

  goToCourse() {
    this.showModal = false;
    this.router.navigate(['/student/courseView']);
  }

  closeModal() {
    this.showModal = false;
  }

}
