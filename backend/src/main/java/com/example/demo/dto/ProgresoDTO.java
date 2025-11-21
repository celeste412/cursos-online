package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgresoDTO {
    private Long id;
    private Long idUsuario;
    private Long idLeccion;
    private boolean completado;
}
