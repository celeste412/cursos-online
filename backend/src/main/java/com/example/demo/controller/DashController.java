package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CursoAvanceDTO;
import com.example.demo.dto.UsuarioRecienteDTO;
import com.example.demo.model.Curso;
import com.example.demo.model.Usuario;
import com.example.demo.service.DashService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DashController {

    private final DashService dashboardService;

    // Solo ADMIN puede ver los totales
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/totales")
    public ResponseEntity<Map<String, Long>> obtenerTotales() {
        Map<String, Long> totales = dashboardService.obtenerTotales();
        return ResponseEntity.ok(totales);
    }

    @GetMapping("/ultimos-cursos")
    public List<Curso> ultimosCursos() {
        return dashboardService.obtenerUltimosCursos(2); // últimos 5 cursos
    }

    @GetMapping("/ultimos-usuarios")
    public List<Usuario> ultimosUsuarios() {
        return dashboardService.obtenerUltimosUsuarios(2); // últimos 5 usuarios
    }

    @GetMapping("/avance-cursos")
    public List<CursoAvanceDTO> getAvanceCursos() {
        return dashboardService.obtenerAvancePromedioCursos();
    }

    @GetMapping("/usuarios-recientes")
    public List<UsuarioRecienteDTO> getUltimosUsuarios(
            @RequestParam(defaultValue = "5") int limit) {
        return dashboardService.obtenerUltimosEstudiantes(limit);
    }
}
