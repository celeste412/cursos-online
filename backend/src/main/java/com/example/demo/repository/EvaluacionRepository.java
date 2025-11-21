package com.example.demo.repository;

import com.example.demo.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByLeccionId(Long leccionId);
    Optional<Evaluacion> findById(Long id);
}
