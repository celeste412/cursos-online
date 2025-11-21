import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { usuarioService } from '../services/usuarioService';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {

  usuarios: any[] = [];
  private usuarioService = inject(usuarioService);

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token, inicia sesión primero.');
      return;
    }

    this.usuarioService.listarUsuarios(token).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }
}
