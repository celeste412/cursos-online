import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-student',
  imports: [],
  templateUrl: './nav-student.html',
  styleUrl: './nav-student.scss',
})
export class NavStudent {

  constructor(private router: Router) {}

  handleLogout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
