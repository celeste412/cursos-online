import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
    id: number;
    titulo: string;
    descripcion?: string;
    fechaCreacion: string;
    imagenUrl?: string;
    students?: number;
}

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    private apiUrl = 'http://localhost:8080/api/profesor';

    constructor(private http: HttpClient) { }


    getMisCursos(): Observable<Curso[]> {
        const token = localStorage.getItem('token'); // JWT guardado
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Curso[]>(`${this.apiUrl}/mis-cursos`, { headers });
    }

}
