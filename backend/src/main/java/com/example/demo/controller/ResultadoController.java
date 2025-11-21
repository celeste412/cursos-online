package com.example.demo.controller;

import com.example.demo.dto.ResultadoDTO;
import com.example.demo.service.ResultadoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resultados")
public class ResultadoController {

    private final ResultadoService resultadoService;

    public ResultadoController(ResultadoService resultadoService) {
        this.resultadoService = resultadoService;
    }

    // Solo ESTUDIANTE puede registrar su resultado
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PostMapping("/evaluacion/{evaluacionId}")
    public ResponseEntity<ResultadoDTO> registrarResultado(
            @PathVariable Long evaluacionId,
            @RequestBody ResultadoDTO resultadoDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resultadoService.registrarResultado(evaluacionId, resultadoDTO));
    }

    // ADMIN, EDITOR o ESTUDIANTE pueden consultar resultados
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}/evaluacion/{evaluacionId}")
    public ResponseEntity<?> obtenerResultado(
            @PathVariable Long usuarioId,
            @PathVariable Long evaluacionId) {
        try {
            ResultadoDTO dto = resultadoService.obtenerResultado(usuarioId, evaluacionId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno: " + e.getMessage());
        }
    }
}
