import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../services/CursoService';



@Component({
  selector: 'app-view-course',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.scss'
})
export class ViewCourseComponent implements OnInit {
  curso: any = null;

  constructor(private router: Router, private cursoService: CursoService, private route: ActivatedRoute) { }

  activeLink: string = 'cursos';
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
  showModal = false;

  inscribirse() {
    const id = this.route.snapshot.params['id'];

    this.cursoService.inscribir(id).subscribe({
      next: () => {
        this.showModal = true;
        setTimeout(() => this.showModal = false, 2000);
      },
      error: err => console.error("Error inscribiendo:", err)
    });
  }




  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.cursoService.obtenerCursoPorId(id).subscribe({
      next: data => {
        this.curso = data;
        console.log("Curso cargado: ", this.curso);
      },
      error: err => {
        console.error("Error cargando curso:", err);
      }
    });
  }

}
