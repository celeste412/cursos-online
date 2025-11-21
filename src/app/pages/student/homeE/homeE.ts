import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavStudent } from '../../../components/nav-student/nav-student';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [NavStudent, CommonModule, NgFor],
  templateUrl: './homeE.html',
  styleUrl: './homeE.scss',
})
export class HomeE {

  cursosPopulares = [
    { img: '../../assets/img4.png', nombre: 'Nombre del curso', inicio: 'Inicia.......', alumnos: 'N° de Alumnos', descripcion: 'Digital Marketing Ethics: Navigating the Ethical Landscape' },
    { img: '../../assets/img3.png', nombre: 'Nombre del curso', inicio: 'Inicia.......', alumnos: 'N° de Alumnos', descripcion: 'Digital Marketing Ethics: Navigating the Ethical Landscape' }
  ];

  actividades = [
    'Hacer la actividad de Word....',
    'Avance de Proyecto en Python....'
  ];

  constructor(private router: Router) {}

  handleLogout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
