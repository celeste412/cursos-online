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

                // Categoría segura
                .idCategoria(
                        curso.getCategoria() != null ? curso.getCategoria().getId() : null
                )
                .categoriaNombre(
                        curso.getCategoria() != null ? curso.getCategoria().getNombre() : null
                )

                // Editor seguro
                .idEditor(
                        curso.getEditor() != null ? curso.getEditor().getId() : null
                )
                .editorNombre(
                        curso.getEditor() != null ? curso.getEditor().getNombreUsuario() : null
                )

                // Imagen (segura)
                .imagenUrl(curso.getImagenUrl())
                .build();
    }
}