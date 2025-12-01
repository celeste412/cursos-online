package com.example.demo.repository;

import com.example.demo.model.Curso;
import com.example.demo.model.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    long countBy();

    List<Curso> findAllByOrderByFechaCreacionDesc();

    List<Curso> findAllByEditor(Usuario editor);

    List<Curso> findByEditorOrderByFechaCreacionDesc(Usuario editor);

    
}
