package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultadoDTO {
    private Long id;
    private Long idUsuario;
    private String respuesta;
    private boolean correcta;
}
