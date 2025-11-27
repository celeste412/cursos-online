import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-content-courses',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './content-courses.component.html',
  styleUrl: './content-courses.component.scss'
})
export class ContentCoursesComponent {

  material: any = {};

  constructor(private router: Router) {
    this.material = this.router.getCurrentNavigation()?.extras.state;
  }
  activeLink: string = 'cursos-select';
  userMenuOpen: boolean = false;
  modalOpen: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  setActive(link: string) { this.activeLink = link; }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  logout() {
    // 1. Limpiar token o datos de usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirigir al login
    this.router.navigate(['/login']);
  }

  quiz = {
    title: 'Quiz del Módulo 1',
    started: false,
    completed: false,
    question: '¿Cuál es la respuesta correcta?',
    options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    selected: null
  };

  startQuiz() {
    this.quiz.started = true;
  }

  saveQuizAnswer() {
    if (!this.quiz.selected) {
      alert('Seleccione una respuesta.');
      return;
    }

    this.quiz.completed = true;
    this.quiz.started = false;
  }

}
