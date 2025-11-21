package com.example.demo.mapper;

import com.example.demo.dto.MaterialDTO;
import com.example.demo.model.Material;

public class MaterialMapper {
    public static MaterialDTO toDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .tipo(material.getTipo().name())  // Asumiendo que TipoMaterial es un enum
                .url(material.getUrl())
                .leccionId(material.getLeccion().getId())  // ID de la lección
                .leccionTitulo(material.getLeccion().getTitulo())  // Título de la lección
                .build();
    }
}
