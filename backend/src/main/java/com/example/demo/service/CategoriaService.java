package com.example.demo.service;

import com.example.demo.dto.CategoriaDTO;
import com.example.demo.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAll().stream()
                .map(cat -> CategoriaDTO.builder()
                        .id(cat.getId())
                        .nombre(cat.getNombre())
                        .build())
                .toList();
    }
}
