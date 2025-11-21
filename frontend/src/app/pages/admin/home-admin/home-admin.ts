import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavAdmin } from '../../../components/nav-admin/nav-admin';


@Component({
  selector: 'app-home-admin',
  imports: [NavAdmin],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
})
export class HomeAdmin {

  logo = 'assets/logo-cursos.png';
  img3 = 'assets/img3.png';
  img4 = 'assets/img4.png';
  img7 = 'assets/img7.png';
  img8 = 'assets/img8.png';

  cursos = [this.img4, this.img3];
  actividades = [
    'Hacer la actividad de Word....',
    'Avance de Proyecto en Python....'
  ];

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
