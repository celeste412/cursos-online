import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-progreso-estudiante',
  imports: [NgFor],
  templateUrl: './progreso-estudiante.html',
  styleUrl: './progreso-estudiante.scss',
})
export class ProgresoEstudiante {

  estudiantes = [
    { id: 1, nombre: "Juan Pérez", progreso: "80%" },
    { id: 2, nombre: "Ana Gómez", progreso: "55%" },
    { id: 3, nombre: "Carlos Ruiz", progreso: "92%" },
  ];
}
