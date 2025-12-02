package com.example.demo.dto;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeccionDTO {
    private Long id;
    private String titulo;
    private String descripcion;

    private Long moduloId;
    private String moduloTitulo;

    private List<MaterialDTO> materiales;
    private List<EvaluacionDTO> evaluaciones;
}
