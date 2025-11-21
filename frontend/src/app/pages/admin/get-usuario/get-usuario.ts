import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdmin } from '../../../components/nav-admin/nav-admin';


@Component({
  selector: 'app-get-usuario',
  imports: [NavAdmin, CommonModule],
  templateUrl: './get-usuario.html',
  styleUrl: './get-usuario.scss',
})
export class GetUsuario {

  usuarios = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      rol: 'Administrador'
    },
    {
      id: 2,
      nombre: 'Maria',
      apellido: 'Lopez',
      correo: 'maria@example.com',
      rol: 'Profesor'
    }
  ];
}
