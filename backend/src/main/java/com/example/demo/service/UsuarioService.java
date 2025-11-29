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

    // Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Buscar usuario por nombre
    public Usuario buscarPorNombre(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + nombreUsuario));
    }

    public Usuario registrarEstudiante(String nombre, String apellido, String nombreUsuario, String password) {

        if (usuarioRepository.findByNombreUsuario(nombreUsuario).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        // Buscar rol ESTUDIANTE
        Rol rolEstudiante = rolRepository.findByNombreRol("ESTUDIANTE")
                .orElseThrow(() -> new RuntimeException("Rol ESTUDIANTE no existe"));

        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setNombreUsuario(nombreUsuario);
        u.setPassword(passwordEncoder.encode(password));
        u.getRoles().add(rolEstudiante);

        return usuarioRepository.save(u);
    }

    public Usuario registrarUsuario(
            String nombre,
            String apellido,
            String nombreUsuario,
            String password,
            String rolNombre) {

        if (usuarioRepository.findByNombreUsuario(nombreUsuario).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        Rol rol = rolRepository.findByNombreRol(rolNombre)
                .orElseThrow(() -> new RuntimeException("El rol " + rolNombre + " no existe"));

        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setNombreUsuario(nombreUsuario);
        u.setPassword(passwordEncoder.encode(password));
        u.getRoles().add(rol);

        return usuarioRepository.save(u);
    }

    public Usuario editarUsuario(Long id, Usuario u) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(u.getNombre());
        usuario.setApellido(u.getApellido());
        usuario.setNombreUsuario(u.getNombreUsuario());
        usuario.setPassword(u.getPassword());
        usuario.setRoles(u.getRoles());

        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("No existe el usuario");
        }
        usuarioRepository.deleteById(id);
    }

}
