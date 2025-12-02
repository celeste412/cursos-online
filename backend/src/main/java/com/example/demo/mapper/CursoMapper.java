package com.example.demo.mapper;

import java.util.stream.Collectors;

import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.dto.LeccionDTO;
import com.example.demo.dto.MaterialDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.model.Curso;
import com.example.demo.model.Evaluacion;
import com.example.demo.model.Leccion;
import com.example.demo.model.Material;
import com.example.demo.model.Modulo;

public class CursoMapper {

        public static CursoDTO toDTO(Curso curso) {
                String nombreCompleto = null;

                if (curso.getEditor() != null) {
                        String nombre = curso.getEditor().getNombre();
                        String apellido = curso.getEditor().getApellido();

                        if (nombre != null && apellido != null) {
                                nombreCompleto = nombre + " " + apellido;
                        } else {
                                nombreCompleto = curso.getEditor().getNombreUsuario(); // fallback
                        }
                }
                return CursoDTO.builder()
                                .id(curso.getId())
                                .titulo(curso.getTitulo())
                                .descripcion(curso.getDescripcion())
                                .imagenUrl(curso.getImagenUrl())
                                .idCategoria(curso.getCategoria() != null ? curso.getCategoria().getId() : null)
                                .categoriaNombre(curso.getCategoria() != null ? curso.getCategoria().getNombre() : null)
                                .idEditor(curso.getEditor() != null ? curso.getEditor().getId() : null)
                                .editorNombre(nombreCompleto)
                                .modulos(
                                                curso.getModulos() != null ? curso.getModulos().stream()
                                                                .map(CursoMapper::toModuloDTO)
                                                                .collect(Collectors.toList())
                                                                : null)
                                .build();
        }

        public static ModuloDTO toModuloDTO(Modulo modulo) {
                return ModuloDTO.builder()
                                .id(modulo.getId())
                                .titulo(modulo.getTitulo())
                                .descripcion(modulo.getDescripcion())
                                .cursoId(modulo.getCurso().getId())
                                .cursoTitulo(modulo.getCurso().getTitulo())
                                .lecciones(
                                                modulo.getLecciones() != null ? modulo.getLecciones().stream()
                                                                .map(CursoMapper::toLeccionDTO)
                                                                .collect(Collectors.toList())
                                                                : null)
                                .build();
        }

        public static LeccionDTO toLeccionDTO(Leccion leccion) {
                return LeccionDTO.builder()
                                .id(leccion.getId())
                                .titulo(leccion.getTitulo())
                                .descripcion(leccion.getDescripcion())
                                .moduloId(leccion.getModulo().getId())
                                .moduloTitulo(leccion.getModulo().getTitulo())
                                .materiales(
                                                leccion.getMateriales() != null ? leccion.getMateriales().stream()
                                                                .map(CursoMapper::toMaterialDTO)
                                                                .collect(Collectors.toList())
                                                                : null)
                                .evaluaciones(
                                                leccion.getEvaluaciones() != null ? leccion.getEvaluaciones().stream()
                                                                .map(CursoMapper::toEvaluacionDTO)
                                                                .collect(Collectors.toList())
                                                                : null)
                                .build();
        }

        public static MaterialDTO toMaterialDTO(Material material) {
                return MaterialDTO.builder()
                                .id(material.getId())
                                .tipo(material.getTipo().name())
                                .url(material.getUrl())
                                .leccionId(material.getLeccion().getId())
                                .leccionTitulo(material.getLeccion().getTitulo())
                                .build();
        }

        public static EvaluacionDTO toEvaluacionDTO(Evaluacion eval) {
                return EvaluacionDTO.builder()
                                .id(eval.getId())
                                .pregunta(eval.getPregunta())
                                .opcionA(eval.getOpcionA())
                                .opcionB(eval.getOpcionB())
                                .opcionC(eval.getOpcionC())
                                .opcionD(eval.getOpcionD())
                                .respuestaCorrecta(eval.getRespuestaCorrecta())
                                .leccionId(eval.getLeccion().getId())
                                .build();
        }
}
