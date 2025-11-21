import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-profesor',
  imports: [],
  templateUrl: './nav-profesor.html',
  styleUrl: './nav-profesor.scss',
})
export class NavProfesor {

  constructor(private router: Router) { }

  handleLogout() {
    localStorage.removeItem("user");
    this.router.navigate(['/']);
  }

}
