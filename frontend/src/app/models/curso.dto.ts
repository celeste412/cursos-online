// src/app/models/curso.dto.ts

import { ModuloDTO } from "./modulo.DTO";

export interface CursoDTO {
  id?: number;
  titulo: string;
  descripcion?: string;
  fechaCreacion?: string;
  idCategoria?: number;
  categoriaNombre?: string;
  idEditor?: number;
  editorNombre?: string;
  imagenUrl?: string;
  modulos?: ModuloDTO[];
}
