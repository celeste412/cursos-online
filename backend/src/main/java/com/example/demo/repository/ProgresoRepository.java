package com.example.demo.repository;

import com.example.demo.model.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgresoRepository extends JpaRepository<Progreso, Long> {
    Optional<Progreso> findByUsuarioIdAndLeccionId(Long usuarioId, Long leccionId);
}
