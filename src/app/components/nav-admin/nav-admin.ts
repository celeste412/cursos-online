import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-admin',
  imports: [],
  templateUrl: './nav-admin.html',
  styleUrl: './nav-admin.scss',
})
export class NavAdmin {

  constructor(private router: Router) {}

  handleLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
