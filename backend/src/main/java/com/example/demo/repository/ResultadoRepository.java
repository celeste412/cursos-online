package com.example.demo.repository;

import com.example.demo.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
    // Método para encontrar el resultado por id de usuario y id de evaluación
    Optional<Resultado> findByUsuarioIdAndEvaluacionId(Long usuarioId, Long evaluacionId);
}
