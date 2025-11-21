package com.example.demo.mapper;

import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.model.Curso;

import java.util.stream.Collectors;

public class CursoMapper {
    public static CursoDTO toDTO(Curso curso) {
        return CursoDTO.builder()
                .id(curso.getId())
                .titulo(curso.getTitulo())
                .descripcion(curso.getDescripcion())
                .fechaCreacion(curso.getFechaCreacion())
                .modulos(curso.getModulos().stream()
                        .map(ModuloMapper::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}
