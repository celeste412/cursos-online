package com.example.demo.repository;

import com.example.demo.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por nombre (para login)
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    List<Usuario> findAllByRoles_NombreRol(String nombreRol);

    List<Usuario> findAllByRoles_NombreRolOrderByIdDesc(String rol);


}
