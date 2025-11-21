package com.example.demo.mapper;

import com.example.demo.dto.ResultadoDTO;
import com.example.demo.model.Resultado;

public class ResultadoMapper {
    public static ResultadoDTO toDTO(Resultado resultado) {
        return ResultadoDTO.builder()
                .id(resultado.getId())
                .idUsuario(resultado.getUsuario().getId())
                .respuesta(resultado.getRespuesta())
                .correcta(resultado.isCorrecta())
                .build();
    }
}
