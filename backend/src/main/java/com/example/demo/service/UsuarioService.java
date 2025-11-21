package com.example.demo.service;

import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registrar usuario con rol
    public Usuario registrarUsuario(String nombreUsuario, String password, String nombreRol) {
        if (usuarioRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RuntimeException("El usuario ya existe");
        }

        // Buscar rol en BD
        Rol rol = rolRepository.findByNombreRol(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombreRol));

        // Crear usuario
        Usuario usuario = Usuario.builder()
                .nombreUsuario(nombreUsuario)
                .password(passwordEncoder.encode(password)) // se guarda encriptada
                .build();

        usuario.getRoles().add(rol);  

        return usuarioRepository.save(usuario);
    }

    // Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Buscar usuario por nombre
    public Usuario buscarPorNombre(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + nombreUsuario));
    }
}
