package com.example.demo.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private Long idCategoria;    
    private String categoriaNombre;

    private Long idEditor;
    private String editorNombre;
    private String imagenUrl;

    // Solo incluimos los módulos con info básica (sin entrar a curso otra vez)
    private List<ModuloDTO> modulos;
}
