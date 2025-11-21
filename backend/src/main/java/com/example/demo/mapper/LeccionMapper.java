package com.example.demo.mapper;

import com.example.demo.dto.LeccionDTO;
import com.example.demo.model.Leccion;

public class LeccionMapper {
    public static LeccionDTO toDTO(Leccion leccion) {
        return LeccionDTO.builder()
                .id(leccion.getId())
                .titulo(leccion.getTitulo())
                .descripcion(leccion.getDescripcion())
                .moduloId(leccion.getModulo().getId())
                .moduloTitulo(leccion.getModulo().getTitulo())
                .build();
    }
}
