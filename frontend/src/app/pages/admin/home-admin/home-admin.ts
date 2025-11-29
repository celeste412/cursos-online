import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { usuarioService } from '../../../services/usuarioService';



@Component({
  selector: 'app-home-admin',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
})
export class HomeAdmin implements OnInit {
  adminName: string = '';
  usuarios: any[] = [];


  constructor(private router: Router, private usuarioService: usuarioService
  ) { }

  activeLink: string = 'home';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  setActive(link: string) { this.activeLink = link; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  showAction(action: string) {
    this.modalTitle = action;
    this.modalMessage = `Has seleccionado: ${action}`;
    this.modalOpen = true;
  }
  closeModal() { this.modalOpen = false; }
  // Cerrar sesión
  logout() {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token'); // o sessionStorage
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }

  

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.usuarioService.getPerfilAdmin(token).subscribe((data: any) => {
        this.adminName = data.nombreUsuario;
      });
    }
  }

}
