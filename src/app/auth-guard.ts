import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // almacenar rol al hacer login

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['role'];
    if (expectedRole && expectedRole !== role) {
      // si el rol no coincide, redirige al home según rol
      if (role === 'admin') this.router.navigate(['/admin/home']);
      else if (role === 'teacher') this.router.navigate(['/teacher/home']);
      else this.router.navigate(['/student/home']);
      return false;
    }

    return true;
  }
}
