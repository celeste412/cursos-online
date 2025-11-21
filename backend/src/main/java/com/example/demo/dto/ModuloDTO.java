package com.example.demo.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuloDTO {
    private Long id;
    private String titulo;
    private String descripcion;

    // El curso al que pertenece (solo id y titulo para evitar bucle)
    private Long cursoId;
    private String cursoTitulo;

    // las lecciones asociadas
    private List<LeccionDTO> lecciones;
}
