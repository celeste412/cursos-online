import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdmin } from '../../../components/nav-admin/nav-admin';

@Component({
  selector: 'app-reportes-progresos',
  imports: [CommonModule,NavAdmin],
  templateUrl: './reportes-progresos.html',
  styleUrl: './reportes-progresos.scss',
})
export class ReportesProgresos {

  cursos = [
    { id: 1, curso: 'HTML desde Cero', profesor: 'Juan Pérez', inscritos: 35, finalizaron: 20, duracion: '6 horas', fecha: '12/02/2025' },
    { id: 2, curso: 'CSS Avanzado', profesor: 'María López', inscritos: 28, finalizaron: 15, duracion: '8 horas', fecha: '08/02/2025' },
    { id: 3, curso: 'JavaScript Profesional', profesor: 'Carlos Rivera', inscritos: 42, finalizaron: 30, duracion: '12 horas', fecha: '01/02/2025' },
    { id: 4, curso: 'React Básico', profesor: 'Lucía Torres', inscritos: 19, finalizaron: 11, duracion: '10 horas', fecha: '15/01/2025' },
    { id: 5, curso: 'Backend con NodeJS', profesor: 'Pedro García', inscritos: 30, finalizaron: 18, duracion: '15 horas', fecha: '10/01/2025' },
  ];
}
