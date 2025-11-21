import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-view-profesor',
  imports: [],
  templateUrl: './course-view-profesor.html',
  styleUrl: './course-view-profesor.scss',
})
export class CourseViewProfesor implements OnInit {

  id!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  verEstudiantes() {
    console.log('Ver estudiantes inscritos');
  }

  subirMaterial() {
    console.log('Subir material');
  }

  crearClase() {
    console.log('Crear nueva clase');
  }

  editarCurso() {
    console.log('Editar información del curso');
  }
}
