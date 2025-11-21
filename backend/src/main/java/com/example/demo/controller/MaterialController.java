package com.example.demo.controller;

import com.example.demo.dto.MaterialDTO;
import com.example.demo.service.MaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiales")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR','ESTUDIANTE')")
    @GetMapping("/leccion/{idLeccion}")
    public ResponseEntity<List<MaterialDTO>> listarPorLeccion(@PathVariable Long idLeccion) {
        return ResponseEntity.ok(materialService.listarMaterialesPorLeccion(idLeccion));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR')")
    @PostMapping("/leccion/{leccionId}")
    public ResponseEntity<MaterialDTO> crearMaterial(@PathVariable Long leccionId, @RequestBody MaterialDTO dto) {
        MaterialDTO nuevo = materialService.crearMaterial(leccionId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','EDITOR')")
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTO> actualizarMaterial(@PathVariable Long id, @RequestBody MaterialDTO dto) {
        return materialService.actualizarMaterial(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        materialService.eliminarMaterial(id);
        return ResponseEntity.ok("Material eliminado con éxito");
    }
}
