import { LeccionDTO } from './leccion.dto';

export interface ModuloDTO {
  id?: number;
  titulo: string;
  descripcion?: string;
  cursoId?: number;
  cursoTitulo?: string;
  lecciones?: LeccionDTO[];
}
