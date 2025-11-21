package com.example.demo.dto;

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
}
