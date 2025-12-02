// src/app/models/leccion.dto.ts

import { EvaluacionDTO } from "./evaluacion.dto";
import { MaterialDTO } from "./material.dto";

export interface LeccionDTO {
  id?: number;
  titulo: string;
  descripcion?: string;
  moduloId?: number;
  moduloTitulo?: string;

  materiales?: MaterialDTO[];

  evaluaciones?: EvaluacionDTO[];  // ✔ AHORA sí
}