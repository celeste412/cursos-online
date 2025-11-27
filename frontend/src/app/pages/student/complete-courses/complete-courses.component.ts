import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-complete-courses',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule],
  templateUrl: './complete-courses.component.html',
  styleUrl: './complete-courses.component.scss'
})
export class CompleteCoursesComponent {

  constructor(private router: Router) { }

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

  courseName: string = 'Nombre del curso';
  courseDescription: string = 'Descripción corta del curso.';


  modules = [
    {
      id: "M1",
      title: "Módulo 1 – Lorem ipsum dolor sit amet",
      open: false,
      progress: 0,
      lessons: [
        {
          name: "L1: Introducción",
          completed: false,
          open: false, // ✔ NECESARIO
          materials: [
            { id: "M1-1", name: "Qué es Lorem Ipsum", type: "PDF", completed: false },
            { id: "M1-2", name: "Video introductorio", type: "VIDEO", completed: false },
            { id: "M1-3", name: "Quiz Introductorio", type: "QUIZ", completed: false }
          ]
        }
      ]
    },
    {
      id: "M2",
      title: "Módulo 2 – Lorem ipsum dolor sit amet",
      open: false,
      progress: 0,
      lessons: []
    }
  ];


  ngOnInit() {
    this.updateAllProgress();
  }

  toggleModule(index: number) {
    this.modules[index].open = !this.modules[index].open;
  }

  updateModuleProgress(module: any) {
    const total = module.lessons.length;
    const done = module.lessons.filter((l: any) => l.completed).length;

    module.progress = total === 0 ? 0 : Math.round((done / total) * 100);
  }

  updateAllProgress() {
    this.modules.forEach(m => this.updateModuleProgress(m));
  }

  toggleLesson(module: any, lesson: any) {
    lesson.open = !lesson.open;
  }

  openMaterial(module: any, lesson: any, material: any) {
    // Guardamos info para la pantalla del contenido
    this.router.navigate(
      ['/student/content-courses'],
      {
        state: {
          moduleTitle: module.title,
          materialName: material.name,
          type: material.type,
          moduleId: module.id,
          materialId: material.id
        }
      }
    );
  }

  markMaterialAsCompleted(material: any, lesson: any, module: any) {
    material.completed = true;

    // Si todos los materiales de la lección están completos → marcar lección completa
    if (lesson.materials.every((m: any) => m.completed)) {
      lesson.completed = true;
    }

    this.updateModuleProgress(module);
  }



}
