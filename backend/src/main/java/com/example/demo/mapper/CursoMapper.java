package com.example.demo.mapper;

import com.example.demo.dto.CursoDTO;
import com.example.demo.model.Curso;

public class CursoMapper {
    public static CursoDTO toDTO(Curso curso) {
        return CursoDTO.builder()
                .id(curso.getId())
                .titulo(curso.getTitulo())
                .descripcion(curso.getDescripcion())
                .fechaCreacion(curso.getFechaCreacion())
                .idCategoria(curso.getCategoria().getId())
                .categoriaNombre(curso.getCategoria().getNombre())
                .idEditor(curso.getEditor().getId())
                .editorNombre(curso.getEditor().getNombreUsuario())
                .imagenUrl(curso.getImagenUrl())
                .build();
    }

}