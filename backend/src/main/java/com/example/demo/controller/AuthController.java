package com.example.demo.controller;

import com.example.demo.dto.UsuarioRequest;
import com.example.demo.model.Usuario;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registro de usuario con rol (UsuarioService)
    @PostMapping("/register")
    public ResponseEntity<?> registrarEstudiante(@RequestBody Usuario usuario) {

        Usuario creado = usuarioService.registrarEstudiante(
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getNombreUsuario(),
                usuario.getPassword());

        return ResponseEntity.ok(creado);
    }

    // Login con JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String nombreUsuario = request.get("nombreUsuario");
        String password = request.get("password");

        Usuario usuario = usuarioService.buscarPorNombre(nombreUsuario);

        // Verifica la contraseña encriptada
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        // Genera el token JWT
        String token = jwtUtil.generarToken(nombreUsuario);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", usuario.getNombreUsuario(),
                "roles", usuario.getRoles()));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody UsuarioRequest request) {

        Usuario usuario = usuarioService.registrarUsuario(
                request.getNombre(),
                request.getApellido(),
                request.getNombreUsuario(),
                request.getPassword(),
                request.getRol());

        return ResponseEntity.ok(usuario);
    }

}
