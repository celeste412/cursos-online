package com.example.demo.repository;

import com.example.demo.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por nombre (para login)
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    List<Usuario> findAllByRoles_NombreRol(String nombreRol);

    List<Usuario> findAllByRoles_NombreRolOrderByIdDesc(String rol);

    @Query("""
                SELECT u.id, u.nombre, u.apellido, u.nombreUsuario, r.nombreRol, u.fechaCreacion
                FROM Usuario u
                JOIN u.roles r
                WHERE r.nombreRol = :rol
                ORDER BY u.fechaCreacion DESC
            """)
    List<Object[]> findUltimosEstudiantes(
            @Param("rol") String rol,
            Pageable pageable);

}
