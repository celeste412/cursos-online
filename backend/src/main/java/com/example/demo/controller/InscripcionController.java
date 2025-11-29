package com.example.demo.controller;

import com.example.demo.dto.InscripcionDTO;
import com.example.demo.service.InscripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
@RequiredArgsConstructor
public class InscripcionController {

    private final InscripcionService inscripcionService;

    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PostMapping
    public ResponseEntity<InscripcionDTO> inscribir(
            @RequestParam Long usuarioId,
            @RequestParam Long cursoId) {
        return ResponseEntity.ok(inscripcionService.inscribir(usuarioId, cursoId));
    }

    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<InscripcionDTO>> listarPorUsuario(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(inscripcionService.listarCursosDeUsuario(usuarioId));
    }
}
