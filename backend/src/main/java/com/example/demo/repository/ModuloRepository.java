package com.example.demo.repository;

import com.example.demo.model.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    List<Modulo> findByCursoId(Long cursoId);
}
