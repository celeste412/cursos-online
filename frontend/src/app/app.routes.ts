import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; // ajusta la ruta según tu carpeta
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { EmailSent } from './pages/email-sent/email-sent';

import { HomeAdmin } from './pages/admin/home-admin/home-admin';
import { GetUsuario } from './pages/admin/get-usuario/get-usuario';
import { GetCursos } from './pages/admin/get-cursos/get-cursos';
import { ReportesProgresos } from './pages/admin/reportes-progresos/reportes-progresos';

import { HomeProfesor } from './pages/teacher/home-profesor/home-profesor';
import { CourseViewProfesor } from './pages/teacher/course-view-profesor/course-view-profesor';
import { MisCursosProfesor } from './pages/teacher/mis-cursos-profesor/mis-cursos-profesor';
import { ProgresoEstudiante } from './pages/teacher/progreso-estudiante/progreso-estudiante';

import { HomeE } from './pages/student/homeE/homeE';
import { Cursos } from './pages/student/cursos/cursos';
import { MisCursos } from './pages/student/mis-cursos/mis-cursos';
import { CourseView } from './pages/student/course-view/course-view';
import { HomePrincipal } from './pages/home/home';
import { Register } from './pages/student/register/register';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'email-sent', component: EmailSent },

  { path: 'admin/home', component: HomeAdmin },
  { path: 'admin/getUsuario', component: GetUsuario },
  { path: 'admin/getCursos', component: GetCursos },
  { path: 'admin/reportesProgresos', component: ReportesProgresos },

  // Rutas Teacher
  { path: 'teacher/home', component: HomeProfesor },
  { path: 'teacher/mis-cursos', component: MisCursosProfesor },
  { path: 'teacher/curso/:id', component: CourseViewProfesor },
  { path: 'teacher/progreso/:id', component: ProgresoEstudiante },

  // Student
  { path: 'student/home', component: HomeE },
  { path: 'student/cursos', component: Cursos },
  { path: 'student/mis-cursos', component: MisCursos },
  { path: 'student/course/:id', component: CourseView },

  // Página de inicio para todos
  { path: '', component: HomePrincipal },

  // Página 404
  { 
    path: '404', 
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) 
  },

  // Fallback general
  { path: '**', redirectTo: '404' }
];
