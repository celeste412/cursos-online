package com.example.demo.mapper;

import com.example.demo.dto.InscripcionDTO;
import com.example.demo.model.Inscripcion;

public class InscripcionMapper {

    public static InscripcionDTO toDTO(Inscripcion inscripcion) {
        return InscripcionDTO.builder()
                .id(inscripcion.getId())
                .usuario(inscripcion.getUsuario().getNombreUsuario())
                .curso(inscripcion.getCurso().getTitulo())
                .fechaInscripcion(inscripcion.getFechaInscripcion())
                .build();
    }
}
