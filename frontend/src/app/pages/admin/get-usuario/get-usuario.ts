import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { usuarioService } from '../../../services/usuarioService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-usuario',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './get-usuario.html',
  styleUrls: ['./get-usuario.scss'], // <-- corregido
})
export class GetUsuario implements OnInit {

  constructor(
    private router: Router,
    private usuarioService: usuarioService // <-- inyección correcta
  ) { }

  usuarios: any[] = [];
  usuarioEditado: any = {};
  selectedRol: string = '';


  activeLink: string = 'gestion-usuarios';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';

  setActive(link: string) {
    this.activeLink = link;
    this.userMenuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  showAction(title: string) {
    this.modalTitle = title;
    this.modalOpen = true;
    this.userMenuOpen = false;
  }

  closeModal() {
    this.modalOpen = false;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  guardarUsuario() {

    const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
    const nombreUsuario = (document.getElementById('nombreUsuario') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const rol = (document.getElementById('rol') as HTMLSelectElement).value;

    if (!nombre || !apellido || !nombreUsuario || !password || !rol) {
      console.error("Campos incompletos");
      return;
    }

    const data = {
      nombre,
      apellido,
      nombreUsuario,
      password,
      rol
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token no encontrado");
      this.router.navigate(['/login']);
      return;
    }

    // ✔ SOLO ADMIN CREA USUARIOS
    this.usuarioService.crearUsuarioAdmin(data, token).subscribe({
      next: res => {
        alert("Usuario creado correctamente");
        this.cargarUsuarios(); // <-- recarga la tabla automáticamente
        // Opcional: limpiar formulario
        (document.getElementById('nombre') as HTMLInputElement).value = '';
        (document.getElementById('apellido') as HTMLInputElement).value = '';
        (document.getElementById('nombreUsuario') as HTMLInputElement).value = '';
        (document.getElementById('password') as HTMLInputElement).value = '';
        (document.getElementById('rol') as HTMLSelectElement).value = '';
      },
      error: err => alert("Error al crear usuario")
    });
  }

  cargarUsuarios() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioService.listarUsuarios(token).subscribe({
      next: data => {
        console.log('Usuarios cargados', data);
        this.usuarios = data;
      },
      error: err => {
        console.error('Error al cargar usuarios', err);
        if (err.status === 403) alert('No tienes permisos para ver los usuarios');
      }
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: err => console.error("Error al eliminar", err)
    });

  }

  buscarUsuarios(event: any) {
    const term = event.target.value.toLowerCase();
    if (!term) {
      this.cargarUsuarios(); // recarga todos si está vacío
      return;
    }

    this.usuarios = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.nombreUsuario.toLowerCase().includes(term) ||
      (u.roles?.[0]?.nombreRol.toLowerCase().includes(term))
    );
  }


  guardarEdicion() {
    // Guardamos el valor del select de vuelta al objeto usuarioEditado
    this.usuarioEditado.roles[0].nombreRol = this.selectedRol;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token no encontrado");
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioService.editarUsuario(this.usuarioEditado.id, this.usuarioEditado)
      .subscribe({
        next: () => {
          this.cargarUsuarios(); // recarga la lista
          this.modalOpen = false; // cierra modal
        },
        error: err => console.error('Error al editar:', err)
      });
  }

  editar(usuario: any) {
    this.modalOpen = true;
    this.usuarioEditado = { ...usuario };

    // Inicializar roles si están vacíos
    if (!this.usuarioEditado.roles || this.usuarioEditado.roles.length === 0) {
      this.usuarioEditado.roles = [{ nombreRol: 'alumno' }];
    }

    this.selectedRol = this.usuarioEditado.roles[0].nombreRol;
  }


}
