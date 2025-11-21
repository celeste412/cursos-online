package com.example.demo.mapper;

import com.example.demo.dto.ProgresoDTO;
import com.example.demo.model.Progreso;

public class ProgresoMapper {
    public static ProgresoDTO toDTO(Progreso progreso) {
        return ProgresoDTO.builder()
                .id(progreso.getId())
                .completado(progreso.isCompletado())
                .build();
    }
}
