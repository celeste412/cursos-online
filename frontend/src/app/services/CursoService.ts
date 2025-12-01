import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CursoDTO } from '../models/curso.dto';

@Injectable({ providedIn: 'root' })
export class CursoService {
    private apiUrl = 'http://localhost:8080/api/cursos';

    private cachedCategorias: any[] | null = null;
    private cachedEditores: any[] | null = null;

    constructor(private http: HttpClient) { }

    listarCursos(): Observable<any> {
        const headers = this.getHeaders();
        return this.http.get(`${this.apiUrl}`, headers);
    }

    agregarCurso(formData: FormData): Observable<any> {
        const token = localStorage.getItem('token') || '';
        console.log("✅ Token enviado en crear curso:", token ? `Presente (${token.length} caracteres)` : 'Ausente');

        // Para FormData, NO incluyas Content-Type
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/crear`, formData, { headers });
    }

    listarCategorias(): Observable<any[]> {
        console.log('Solicitando categorías al backend...');
        if (this.cachedCategorias) {
            console.log('Devolviendo categorías cacheadas:', this.cachedCategorias);
            return of(this.cachedCategorias);
        }
        const headers = this.getHeaders();
        return this.http.get<any[]>(`${this.apiUrl}/categorias`, headers)
            .pipe(tap(data => {
                console.log('Categorías recibidas del backend:', data);
                this.cachedCategorias = data;
            }));
    }

    listarEditores(): Observable<any[]> {
        console.log('Solicitando editores al backend...');
        if (this.cachedEditores) {
            console.log('Devolviendo editores cacheados:', this.cachedEditores);
            return of(this.cachedEditores);
        }
        const headers = this.getHeaders();
        return this.http.get<any[]>(`${this.apiUrl}/editores`, headers)
            .pipe(tap(data => {
                console.log('Editores recibidos del backend:', data);
                this.cachedEditores = data;
            }));
    }

    private getHeaders() {
        const token = localStorage.getItem('token') || '';
        console.log('🔐 Token usado en headers:', token ? 'PRESENTE' : 'AUSENTE');

        if (!token) {
            console.error('❌ No hay token disponible');
        }

        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    editarCurso(id: number, formData: FormData): Observable<any> {
        const token = localStorage.getItem('token') || '';

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
            // NO pongas Content-Type, Angular lo maneja solo con FormData
        });

        return this.http.put(`${this.apiUrl}/editar/${id}`, formData, { headers });
    }

    // MÉTODO ACTUALIZADO: Especificar responseType como 'text'
    eliminarCurso(id: number): Observable<any> {
        const token = localStorage.getItem('token') || '';

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { 
            headers,
            responseType: 'text'  // ← ESTA ES LA SOLUCIÓN
        });
    }

    trackByCurso(index: number, item: any) {
        return item.id;
    }


    // Cursos asignados al profesor
    getCursosProfesor(): Observable<CursoDTO[]> {
        const headers = this.getHeaders();
        return this.http.get<CursoDTO[]>(`${this.apiUrl}/profesor`, headers);
    }

    // Obtener un curso completo
    getCurso(id: number): Observable<CursoDTO> {
        const headers = this.getHeaders();
        return this.http.get<CursoDTO>(`${this.apiUrl}/${id}`, headers);
    }

    agregarModulo(cursoId: number, estructura: any): Observable<CursoDTO> {
        const headers = this.getHeaders();
        return this.http.post<CursoDTO>(`${this.apiUrl}/${cursoId}/modulos`, estructura, headers);
    }

}