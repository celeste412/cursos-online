
export interface EvaluacionDTO {
  id?: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuestaCorrecta: string;
  leccionId?: number;
}