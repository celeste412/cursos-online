package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/registro-estudiante")
    public ResponseEntity<?> registrarEstudiante(@RequestBody Map<String, String> request) {
        String nombreUsuario = request.get("nombreUsuario");
        String password = request.get("password");

        // Forzar el rol a ESTUDIANTE
        String rol = "ESTUDIANTE";

        Usuario nuevo = usuarioService.registrarUsuario(nombreUsuario, password, rol);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Estudiante registrado correctamente",
                "usuario", nuevo.getNombreUsuario()));
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
}
