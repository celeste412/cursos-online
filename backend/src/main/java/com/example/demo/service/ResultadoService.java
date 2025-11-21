package com.example.demo.service;

import com.example.demo.dto.ResultadoDTO;
import com.example.demo.model.Resultado;
import com.example.demo.model.Evaluacion;
import com.example.demo.model.Usuario;
import com.example.demo.repository.ResultadoRepository;
import com.example.demo.repository.EvaluacionRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class ResultadoService {

    private final ResultadoRepository resultadoRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final UsuarioRepository usuarioRepository;

    public ResultadoService(ResultadoRepository resultadoRepository, EvaluacionRepository evaluacionRepository, UsuarioRepository usuarioRepository) {
        this.resultadoRepository = resultadoRepository;
        this.evaluacionRepository = evaluacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Registrar el resultado de un usuario en una evaluación
    public ResultadoDTO registrarResultado(Long evaluacionId, ResultadoDTO dto) {
        // Buscar la evaluación y el usuario
        Evaluacion evaluacion = evaluacionRepository.findById(evaluacionId)
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear el resultado
        Resultado resultado = new Resultado();
        resultado.setRespuesta(dto.getRespuesta());
        resultado.setCorrecta(dto.getRespuesta().equals(evaluacion.getRespuestaCorrecta()));
        resultado.setEvaluacion(evaluacion);
        resultado.setUsuario(usuario);

        // Guardar el resultado
        Resultado guardado = resultadoRepository.save(resultado);

        // Devolver el DTO con el idUsuario
        return new ResultadoDTO(
                guardado.getId(),
                guardado.getUsuario().getId(),  // Obtener el idUsuario de la relación Usuario
                guardado.getRespuesta(),
                guardado.isCorrecta());
    }

    // Obtener el resultado de un usuario en una evaluación
    public ResultadoDTO obtenerResultado(Long usuarioId, Long evaluacionId) {
        Resultado resultado = resultadoRepository.findByUsuarioIdAndEvaluacionId(usuarioId, evaluacionId)
                .orElseThrow(() -> new RuntimeException("Resultado no encontrado"));

        // Devolver el DTO con el idUsuario
        return new ResultadoDTO(
                resultado.getId(),
                resultado.getUsuario().getId(),  // Obtener el idUsuario de la relación Usuario
                resultado.getRespuesta(),
                resultado.isCorrecta());
    }
}
