package com.example.demo.controller;

import com.example.demo.dto.ProgresoDTO;
import com.example.demo.service.ProgresoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progreso")
public class ProgresoController {

    private final ProgresoService progresoService;

    public ProgresoController(ProgresoService progresoService) {
        this.progresoService = progresoService;
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}/leccion/{leccionId}")
    public ResponseEntity<ProgresoDTO> obtenerProgreso(@PathVariable Long usuarioId, @PathVariable Long leccionId) {
        return ResponseEntity.ok(progresoService.obtenerProgreso(usuarioId, leccionId));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
    @PutMapping("/usuario/{usuarioId}/leccion/{leccionId}")
    public ResponseEntity<ProgresoDTO> actualizarProgreso(
            @PathVariable Long usuarioId,
            @PathVariable Long leccionId,
            @RequestBody ProgresoDTO progresoDTO) {
        return ResponseEntity.ok(progresoService.actualizarProgreso(usuarioId, leccionId, progresoDTO));
    }
}
