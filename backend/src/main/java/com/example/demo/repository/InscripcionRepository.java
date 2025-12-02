package com.example.demo.repository;

import com.example.demo.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    Optional<Inscripcion> findByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);

    List<Inscripcion> findByUsuarioId(Long usuarioId);

    List<Inscripcion> findByCursoId(Long cursoId);

    boolean existsByCursoIdAndUsuarioId(Long cursoId, Long usuarioId);
    

}
