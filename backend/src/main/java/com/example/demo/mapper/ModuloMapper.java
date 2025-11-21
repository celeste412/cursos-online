package com.example.demo.mapper;

import com.example.demo.dto.ModuloDTO;
import com.example.demo.dto.LeccionDTO;
import com.example.demo.model.Modulo;

import java.util.stream.Collectors;

public class ModuloMapper {
    public static ModuloDTO toDTO(Modulo modulo) {
        return ModuloDTO.builder()
                .id(modulo.getId())
                .titulo(modulo.getTitulo())
                .descripcion(modulo.getDescripcion())
                .cursoId(modulo.getCurso().getId())
                .cursoTitulo(modulo.getCurso().getTitulo())
                .lecciones(modulo.getLecciones().stream()
                        .map(LeccionMapper::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}
