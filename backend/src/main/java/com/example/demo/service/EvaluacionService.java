package com.example.demo.service;

import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.model.Evaluacion;
import com.example.demo.model.Leccion;
import com.example.demo.repository.EvaluacionRepository;
import com.example.demo.repository.LeccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final LeccionRepository leccionRepository;

    public EvaluacionService(EvaluacionRepository evaluacionRepository, LeccionRepository leccionRepository) {
        this.evaluacionRepository = evaluacionRepository;
        this.leccionRepository = leccionRepository;
    }

    public List<EvaluacionDTO> listarEvaluacionesPorLeccion(Long leccionId) {
        return evaluacionRepository.findByLeccionId(leccionId).stream()
                .map(evaluacion -> new EvaluacionDTO(
                        evaluacion.getId(),
                        evaluacion.getPregunta(),
                        evaluacion.getOpcionA(),
                        evaluacion.getOpcionB(),
                        evaluacion.getOpcionC(),
                        evaluacion.getOpcionD(),
                        evaluacion.getRespuestaCorrecta()))
                .collect(Collectors.toList());
    }

    public EvaluacionDTO crearEvaluacion(Long leccionId, EvaluacionDTO dto) {
        Leccion leccion = leccionRepository.findById(leccionId)
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setPregunta(dto.getPregunta());
        evaluacion.setOpcionA(dto.getOpcionA());
        evaluacion.setOpcionB(dto.getOpcionB());
        evaluacion.setOpcionC(dto.getOpcionC());
        evaluacion.setOpcionD(dto.getOpcionD());
        evaluacion.setRespuestaCorrecta(dto.getRespuestaCorrecta());
        evaluacion.setLeccion(leccion);

        Evaluacion guardada = evaluacionRepository.save(evaluacion);

        return new EvaluacionDTO(
                guardada.getId(),
                guardada.getPregunta(),
                guardada.getOpcionA(),
                guardada.getOpcionB(),
                guardada.getOpcionC(),
                guardada.getOpcionD(),
                guardada.getRespuestaCorrecta());
    }
}
