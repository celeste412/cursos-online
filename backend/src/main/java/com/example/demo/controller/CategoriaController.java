package com.example.demo.controller;

import com.example.demo.dto.CategoriaDTO;
import com.example.demo.model.Categoria;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final CategoriaRepository categoriaRepository;

    // SOLO ADMIN puede listar
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<CategoriaDTO> listar() {
        return categoriaService.listarCategorias();
    }

    // SOLO ADMIN puede crear categoría
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CategoriaDTO dto) {
        Categoria cat = new Categoria();
        cat.setNombre(dto.getNombre());

        categoriaRepository.save(cat);

        return ResponseEntity.ok("Categoría creada");
    }
}
