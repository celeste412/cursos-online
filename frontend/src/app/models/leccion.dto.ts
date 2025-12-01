// src/app/models/leccion.dto.ts

import { MaterialDTO } from "./Material.dto";


export interface LeccionDTO {
  id?: number;
  titulo: string;
  descripcion?: string;
  moduloId?: number;
  moduloTitulo?: string;
  materiales?: MaterialDTO[];
}
