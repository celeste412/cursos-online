import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);


  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['', Validators.required],
  });

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }
  get role() { return this.loginForm.get('role')!; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password, role } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (resp) => {
        console.log(resp);
        localStorage.setItem('token', resp.token);
        // Redirige según rol
        if (role === 'admin') this.router.navigate(['/admin/home']);
        else if (role === 'teacher') this.router.navigate(['/teacher/home']);
        else if (role === 'student') this.router.navigate(['/student/home']);
      },
      error: (err) => console.error(err)
    });
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
