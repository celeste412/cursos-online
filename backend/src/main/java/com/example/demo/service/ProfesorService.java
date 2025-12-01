package com.example.demo.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Curso;
import com.example.demo.model.Leccion;
import com.example.demo.model.Material;
import com.example.demo.model.Modulo;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.LeccionRepository;
import com.example.demo.repository.MaterialRepository;
import com.example.demo.repository.ModuloRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profesor")
@RequiredArgsConstructor
public class ProfesorService {

    private final CursoRepository cursoRepository;
    private final ModuloRepository moduloRepository;
    private final LeccionRepository leccionRepository;
    private final MaterialRepository materialRepository;

    // Obtener cursos asignados al profesor
    public List<Curso> obtenerCursosAsignados(Usuario profesor) {
        return cursoRepository.findByEditorOrderByFechaCreacionDesc(profesor);
    }

     public Modulo agregarModulo(Long cursoId, Modulo modulo) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        modulo.setCurso(curso);
        return moduloRepository.save(modulo);
    }

    public Leccion agregarLeccion(Long moduloId, Leccion leccion) {
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        leccion.setModulo(modulo);
        return leccionRepository.save(leccion);
    }

    public Material agregarMaterial(Long leccionId, Material material) {
        Leccion leccion = leccionRepository.findById(leccionId)
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));
        material.setLeccion(leccion);
        return materialRepository.save(material);
    }
}
