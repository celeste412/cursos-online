package com.example.demo.service;

import com.example.demo.dto.MaterialDTO;
import com.example.demo.mapper.MaterialMapper;
import com.example.demo.model.Material;
import com.example.demo.model.Leccion;
import com.example.demo.model.TipoMaterial;
import com.example.demo.repository.MaterialRepository;
import com.example.demo.repository.LeccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final LeccionRepository leccionRepository;

    public MaterialService(MaterialRepository materialRepository, LeccionRepository leccionRepository) {
        this.materialRepository = materialRepository;
        this.leccionRepository = leccionRepository;
    }

    // 🔹 Listar materiales por lección (NO por módulo)
    public List<MaterialDTO> listarMaterialesPorLeccion(Long idLeccion) {
        return materialRepository.findByLeccionId(idLeccion)
                .stream()
                .map(MaterialMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Crear un material dentro de una lección
public MaterialDTO crearMaterial(Long idLeccion, MaterialDTO dto) {
    if (dto.getTipo() == null) {
        throw new IllegalArgumentException("El tipo de material no puede ser nulo");
    }

    Leccion leccion = leccionRepository.findById(idLeccion)
            .orElseThrow(() -> new RuntimeException("Lección no encontrada con id: " + idLeccion));

    Material material = Material.builder()
            .tipo(TipoMaterial.valueOf(dto.getTipo().toUpperCase()))
            .url(dto.getUrl())
            .leccion(leccion)
            .build();

    return MaterialMapper.toDTO(materialRepository.save(material));
}

    // 🔹 Actualizar material
    public Optional<MaterialDTO> actualizarMaterial(Long id, MaterialDTO dto) {
        if (dto.getTipo() == null) {
            throw new IllegalArgumentException("El tipo de material no puede ser nulo");
        }

        return materialRepository.findById(id)
                .map(material -> {
                    material.setTipo(TipoMaterial.valueOf(dto.getTipo().toUpperCase()));
                    material.setUrl(dto.getUrl());
                    return MaterialMapper.toDTO(materialRepository.save(material));
                });
    }

    // 🔹 Eliminar material
    public void eliminarMaterial(Long id) {
        materialRepository.deleteById(id);
    }
}
