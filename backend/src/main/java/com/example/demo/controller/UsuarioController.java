package com.example.demo.controller;

import com.example.demo.dto.UsuarioRequest;
import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Solo ADMIN puede registrar usuarios
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/crear-estudiante")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody UsuarioRequest request) {
        Usuario usuario = usuarioService.registrarUsuario(
                request.getNombreUsuario(),
                request.getPassword(),
                request.getRol()
        );
        return ResponseEntity.ok(usuario);
    }

    // Solo ADMIN puede listar usuarios
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/estudiantes")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    // Solo ADMIN puede buscar por nombre
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/{nombreUsuario}")
    public ResponseEntity<Usuario> buscarPorNombre(@PathVariable String nombreUsuario) {
        return ResponseEntity.ok(usuarioService.buscarPorNombre(nombreUsuario));
    }
}
