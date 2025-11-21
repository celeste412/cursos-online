package com.example.demo.service;

import com.example.demo.dto.CursoDTO;
import com.example.demo.mapper.CursoMapper;
import com.example.demo.model.Curso;
import com.example.demo.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;

    public CursoDTO crearCurso(Curso curso) {
        return CursoMapper.toDTO(cursoRepository.save(curso));
    }

    public List<CursoDTO> listarCursos() {
        return cursoRepository.findAll()
                .stream()
                .map(CursoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CursoDTO obtenerCurso(Long id) {
        return cursoRepository.findById(id)
                .map(CursoMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    public CursoDTO editarCurso(Long id, Curso cursoActualizado) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        curso.setTitulo(cursoActualizado.getTitulo());
        curso.setDescripcion(cursoActualizado.getDescripcion());
        return CursoMapper.toDTO(cursoRepository.save(curso));
    }

    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso no encontrado con id " + id);
        }
        cursoRepository.deleteById(id);
    }

}
