package com.example.demo.service;

import com.example.demo.dto.LeccionDTO;
import com.example.demo.mapper.LeccionMapper;
import com.example.demo.model.Leccion;
import com.example.demo.model.Modulo;
import com.example.demo.repository.LeccionRepository;
import com.example.demo.repository.ModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeccionService {

    private final LeccionRepository leccionRepository;
    private final ModuloRepository moduloRepository;

    public LeccionDTO crearLeccion(Long moduloId, Leccion leccion) {
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        leccion.setModulo(modulo);
        return LeccionMapper.toDTO(leccionRepository.save(leccion));
    }

    public List<LeccionDTO> listarPorModulo(Long moduloId) {
        return leccionRepository.findByModuloId(moduloId)
                .stream()
                .map(LeccionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
