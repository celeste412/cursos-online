package com.example.demo.service;

import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.model.Evaluacion;
import com.example.demo.model.Leccion;
import com.example.demo.repository.EvaluacionRepository;
import com.example.demo.repository.LeccionRepository;

import jakarta.transaction.Transactional;

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
    /* 
    public List<EvaluacionDTO> listarEvaluacionesPorLeccion(Long leccionId) {
        return evaluacionRepository.findByLeccionId(leccionId).stream()
                .map(evaluacion -> new EvaluacionDTO(
                        evaluacion.getId(),
                        evaluacion.getPregunta(),
                        evaluacion.getOpcionA(),
                        evaluacion.getOpcionB(),
                        evaluacion.getOpcionC(),
                        evaluacion.getOpcionD(),
                        evaluacion.getRespuestaCorrecta(),
                        evaluacion.getLeccion()
                    ))
                .collect(Collectors.toList());
    }*/

    @Transactional
    public Evaluacion crearEvaluacion(EvaluacionDTO dto) {
        Leccion leccion = leccionRepository.findById(dto.getLeccionId())
                .orElseThrow(() -> new RuntimeException("Leccion no existe"));

        Evaluacion e = new Evaluacion();
        e.setPregunta(dto.getPregunta());
        e.setOpcionA(dto.getOpcionA());
        e.setOpcionB(dto.getOpcionB());
        e.setOpcionC(dto.getOpcionC());
        e.setOpcionD(dto.getOpcionD());
        e.setRespuestaCorrecta(dto.getRespuestaCorrecta());
        e.setLeccion(leccion);

        return evaluacionRepository.save(e);
    }

}
