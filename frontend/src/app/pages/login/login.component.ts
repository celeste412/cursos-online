import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);

  showPassword = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (resp: any) => {
        console.log(resp);

        const role = resp.roles && resp.roles.length > 0
          ? resp.roles[0].nombreRol.toUpperCase()
          : null;

        localStorage.setItem('token', resp.token);
        localStorage.setItem('role', role);

        if (role === 'ADMINISTRADOR')
          this.router.navigate(['/admin/home']);
        else if (role === 'EDITOR')
          this.router.navigate(['/teacher/home']);
        else if (role === 'ESTUDIANTE')
          this.router.navigate(['/student/home']);
        else
          this.router.navigate(['/login']);
      }
      ,
      error: () => {
        alert('Usuario o contraseña incorrectos');
        this.loginForm.reset(); 
      }
    });
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
