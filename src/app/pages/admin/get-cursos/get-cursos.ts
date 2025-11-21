import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdmin } from '../../../components/nav-admin/nav-admin';


@Component({
  selector: 'app-get-cursos',
  imports: [NavAdmin, CommonModule],
  templateUrl: './get-cursos.html',
  styleUrl: './get-cursos.scss',
})
export class GetCursos {

  logo = 'assets/logo-cursos.png';
  img4 = 'assets/img4.png';

  cursos = [1, 2, 3, 4]; // temporal, como tu map de React
}
