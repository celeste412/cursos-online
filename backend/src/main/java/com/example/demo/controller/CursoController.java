package com.example.demo.controller;

import com.example.demo.dto.CursoDTO;
import com.example.demo.model.Curso;
import com.example.demo.service.CursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    // ADMIN puede crear cursos
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<CursoDTO> crearCurso(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.crearCurso(curso));
    }

    // ADMIN o EDITOR pueden editar cursos
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR')")
    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> editarCurso(@PathVariable Long id, @RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.editarCurso(id, curso));
    }

    // Todos pueden ver cursos
    @GetMapping("/public")
    public ResponseEntity<List<CursoDTO>> listarCursos() {
        return ResponseEntity.ok(cursoService.listarCursos());
    }

    // Todos pueden ver detalle del curso
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> obtenerCurso(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.obtenerCurso(id));
    }

    // Solo ADMIN puede eliminar
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable Long id) {
        cursoService.eliminarCurso(id);
        return ResponseEntity.noContent().build();
    }
}
