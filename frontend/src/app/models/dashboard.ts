// src/app/models/curso.dto.ts

export interface CursoAvance {
  idCurso: number;
  titulo: string;
  avancePromedio: number; // 0-100
}

export interface UsuarioReciente {
  id: number;
  nombreMostrar: string;
  rol: string;
  fechaRegistro: string;
}
