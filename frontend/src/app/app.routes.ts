import { Routes } from '@angular/router';
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

import { MisCursos } from './pages/student/mis-cursos/mis-cursos';
import { HomePrincipal } from './pages/home/home';
import { Register } from './pages/student/register/register';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { LoginComponent } from './pages/login/login.component';
import { DashEstudianteComponent } from './pages/student/dash-estudiante/dash-estudiante.component';
import { ViewCourseComponent } from './pages/student/view-course/view-course.component';
import { CompleteCoursesComponent } from './pages/student/complete-courses/complete-courses.component';
import { ContentCoursesComponent } from './pages/student/content-courses/content-courses.component';
import { MisCursosSelectComponent } from './pages/student/mis-cursos-select/mis-cursos-select.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
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
  { path: 'teacher/content/:id', component: CourseViewProfesor },
  { path: 'teacher/progreso', component: ProgresoEstudiante },

  // Student
  { path: 'student/home', component: DashEstudianteComponent },
  { path: 'student/cursos', component: MisCursos },
  { path: 'student/view/:id', component: ViewCourseComponent },
  { path: 'student/cursos-select', component: MisCursosSelectComponent },
  { path: 'student/complete-courses/:id', component: CompleteCoursesComponent },
  { path: 'student/content-courses', component: ContentCoursesComponent },
  
  //{ path: 'student/mis-cursos', component: MisCursos },

  // Página de inicio para todos
  { path: '', component: HomePrincipal },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'catalogo', component: CatalogoComponent },


  // Página 404
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  },

  // Fallback general
  { path: '**', redirectTo: '404' }
];
