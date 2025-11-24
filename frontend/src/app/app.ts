import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('CursosOnline');
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Oculta navbar/footer en rutas que comiencen con /admin, /teacher o /student
        this.showLayout = !(
          event.urlAfterRedirects.startsWith('/admin') ||
          event.urlAfterRedirects.startsWith('/teacher') ||
          event.urlAfterRedirects.startsWith('/student')
        );
      }
    });
  }
}
