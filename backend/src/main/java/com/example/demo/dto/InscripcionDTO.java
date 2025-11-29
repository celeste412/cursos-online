package com.example.demo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscripcionDTO {
    private Long id;
    private String usuario;
    private String curso;
    private LocalDateTime fechaInscripcion;
}
