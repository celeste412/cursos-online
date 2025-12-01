import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  // Cargar usuario desde localStorage al iniciar
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.setUser(user);
      } catch (e) {
        console.error('Error parsing user data from storage:', e);
      }
    }
  }

  // Establecer usuario
  setUser(user: any): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtener usuario actual
  getUser(): any {
    return this.userSubject.value;
  }

  // Obtener nombre del usuario
  getUserName(): string {
    const user = this.userSubject.value;
    return user?.nombre || user?.username || 'Administrador';
  }

  // Limpiar usuario (logout)
  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}