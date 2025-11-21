import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../safe-url-pipe';
import { RouterModule } from '@angular/router';

interface Clase {
  title: string;
  video: string;
  description: string;
}

interface Modulo {
  title: string;
  classes: Clase[];
}


@Component({
  selector: 'app-course-view',
  imports: [CommonModule, RouterModule, SafeUrlPipe],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {

  modules: Modulo[] = [
    {
      title: 'Módulo 1: Introducción',
      classes: [
        { title: '¿Qué es HTML?', video: 'https://www.youtube.com/embed/MJkdaVFHrto', description: 'En esta clase aprenderás qué es HTML y para qué sirve.' },
        { title: 'Instalación de VSCode', video: 'https://www.youtube.com/embed/bSrm9RXwBaI', description: 'Aprende a instalar y configurar Visual Studio Code.' },
        { title: 'Estructura básica', video: 'https://www.youtube.com/embed/UB1O30fR-EE', description: 'Conoce cómo se estructura un documento HTML.' }
      ]
    },
    {
      title: 'Módulo 2: Etiquetas básicas',
      classes: [
        { title: 'Párrafos', video: 'https://www.youtube.com/embed/inn4hP6Z_7E', description: 'Cómo usar la etiqueta <p> y otros elementos de texto.' },
        { title: 'Imágenes', video: 'https://www.youtube.com/embed/AEaK_8ZM3JQ', description: 'Aprende a mostrar imágenes con la etiqueta <img>.' },
        { title: 'Enlaces', video: 'https://www.youtube.com/embed/XiT5J5YdS94', description: 'Cómo funcionan los enlaces con <a>.' }
      ]
    },
    {
      title: 'Módulo 3: Tablas y Formularios',
      classes: [
        { title: 'Tablas', video: 'https://www.youtube.com/embed/04xM_vyT6bI', description: 'Aprende a crear tablas con HTML.' },
        { title: 'Inputs', video: 'https://www.youtube.com/embed/fNcJuPIZ2WE', description: 'Tipos de input y atributos importantes.' },
        { title: 'Formularios completos', video: 'https://www.youtube.com/embed/Q2imkhmhOFo', description: 'Construye formularios completos en HTML.' }
      ]
    }
  ];
  classSelected: Clase = this.modules[0].classes[0];

  selectClass(clase: Clase) {
    this.classSelected = clase;
  }

}
