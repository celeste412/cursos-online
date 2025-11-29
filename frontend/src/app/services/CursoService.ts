import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CursoService {
    private apiUrl = 'http://localhost:8080/api/cursos';

    constructor(private http: HttpClient) { }

    listarCursos(): Observable<any> {
        // No envíes headers de autorización si es un endpoint público
        return this.http.get(`${this.apiUrl}/public`);
    }

}
