package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialDTO {
    private Long id;
    private String tipo;
    private String url;
    private Long leccionId;  // ID de la lección a la que pertenece
    private String leccionTitulo;  // Título de la lección
}
