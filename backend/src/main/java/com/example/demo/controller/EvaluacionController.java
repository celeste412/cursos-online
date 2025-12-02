package com.example.demo.controller;

import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.service.EvaluacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    public EvaluacionController(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    /*
     * @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
     * 
     * @GetMapping("/leccion/{leccionId}")
     * public ResponseEntity<List<EvaluacionDTO>>
     * listarEvaluacionesPorLeccion(@PathVariable Long leccionId) {
     * return
     * ResponseEntity.ok(evaluacionService.listarEvaluacionesPorLeccion(leccionId));
     * }
     */

    @PostMapping("/evaluaciones")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<?> crearEvaluacion(@RequestBody EvaluacionDTO dto) {
        return ResponseEntity.ok(evaluacionService.crearEvaluacion(dto));
    }

}
