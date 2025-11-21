package com.example.demo.mapper;

import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.model.Evaluacion;

public class EvaluacionMapper {
    public static EvaluacionDTO toDTO(Evaluacion evaluacion) {
        return EvaluacionDTO.builder()
                .id(evaluacion.getId())
                .pregunta(evaluacion.getPregunta())
                .opcionA(evaluacion.getOpcionA())
                .opcionB(evaluacion.getOpcionB())
                .opcionC(evaluacion.getOpcionC())
                .opcionD(evaluacion.getOpcionD())
                .respuestaCorrecta(evaluacion.getRespuestaCorrecta())
                .build();
    }
}
