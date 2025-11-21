package com.example.demo.repository;

import com.example.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por nombre (para login)
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    // Verificar si existe un usuario por nombre
    boolean existsByNombreUsuario(String nombreUsuario);
}
