package com.example.demo.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Curso;
import com.example.demo.model.Leccion;
import com.example.demo.model.Material;
import com.example.demo.model.Modulo;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.ProfesorService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/profesor")
@RequiredArgsConstructor
public class ProfesorController {

    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfesorService profesorService;

    @GetMapping("/mis-cursos")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMINISTRADOR')")
    public List<Curso> misCursos() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByNombreUsuario(username).orElseThrow();

        if (usuario.getRoles().stream().anyMatch(r -> r.getNombreRol().equalsIgnoreCase("EDITOR"))) {
            return cursoRepository.findByEditorOrderByFechaCreacionDesc(usuario);
        } else {
            return cursoRepository.findAllByOrderByFechaCreacionDesc();
        }
    }

    @PostMapping("/cursos/{cursoId}/modulos")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMINISTRADOR')")
    public Modulo agregarModulo(@PathVariable Long cursoId, @RequestBody Modulo modulo) {
        return profesorService.agregarModulo(cursoId, modulo);
    }

    @PostMapping("/modulos/{moduloId}/lecciones")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMINISTRADOR')")
    public Leccion agregarLeccion(@PathVariable Long moduloId, @RequestBody Leccion leccion) {
        return profesorService.agregarLeccion(moduloId, leccion);
    }

    @PostMapping("/lecciones/{leccionId}/materiales")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMINISTRADOR')")
    public Material agregarMaterial(@PathVariable Long leccionId, @RequestBody Material material) {
        return profesorService.agregarMaterial(leccionId, material);
    }

}
