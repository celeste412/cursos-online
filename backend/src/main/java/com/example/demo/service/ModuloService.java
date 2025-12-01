package com.example.demo.service;

import com.example.demo.dto.ModuloDTO;
import com.example.demo.mapper.ModuloMapper;
import com.example.demo.model.Curso;
import com.example.demo.model.Modulo;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.ModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuloService {

    private final ModuloRepository moduloRepository;
    private final CursoRepository cursoRepository;

    public ModuloDTO crearModuloEnCurso(Long cursoId, ModuloDTO dto) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Modulo modulo = new Modulo();
        modulo.setTitulo(dto.getTitulo());
        modulo.setDescripcion(dto.getDescripcion());
        modulo.setCurso(curso);

        Modulo guardado = moduloRepository.save(modulo);

        return ModuloMapper.toDTO(guardado); // 👈 usas el mapper estático
    }

    public List<ModuloDTO> listarPorCurso(Long cursoId) {
        return moduloRepository.findByCursoId(cursoId).stream()
                .map(ModuloMapper::toDTO) // 👈 mapper aquí
                .toList();
    }

    public ModuloDTO obtenerModulo(Long id) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        return ModuloMapper.toDTO(modulo); // 👈 mapper aquí también
    }
}

