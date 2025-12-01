package com.example.demo.controller;

import com.example.demo.dto.CategoriaDTO;
import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.dto.UsuarioDTO;
import com.example.demo.model.Curso;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.CursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/crear")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> crearCurso(
            @RequestPart("curso") CursoDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {

        System.out.println("=== 🔐 CREAR CURSO - AUTORIZACIÓN ===");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Usuario: " + auth.getName());
        System.out.println("Roles: " + auth.getAuthorities());
        System.out.println("Está autenticado: " + auth.isAuthenticated());
        System.out.println("=====================================");

        System.out.println("=== 📦 CREAR CURSO - DATOS RECIBIDOS ===");
        System.out.println("Título: " + dto.getTitulo());
        System.out.println("Descripción: " + dto.getDescripcion());
        System.out.println("Categoría ID: " + dto.getIdCategoria());
        System.out.println("Editor ID: " + dto.getIdEditor());
        System.out.println("Imagen: " + (imagen != null ? imagen.getOriginalFilename() : "null"));
        System.out.println("========================================");

        try {
            CursoDTO cursoCreado = cursoService.crearCurso(dto, imagen);
            return ResponseEntity.ok(cursoCreado);
        } catch (Exception e) {
            System.out.println("❌ ERROR al crear curso: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<CursoDTO>> listarCursos() {
        return ResponseEntity.ok(cursoService.listarCursos());
    }

    // Solo ADMIN puede listar editores
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/editores")
    public List<UsuarioDTO> listarEditores() {
        return usuarioRepository.findAllByRoles_NombreRol("EDITOR").stream()
                .map(user -> new UsuarioDTO(user.getId(), user.getNombre()))
                .toList();
    }

    // Solo ADMIN puede listar categorías
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/categorias")
    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(cat -> new CategoriaDTO(cat.getId(), cat.getNombre()))
                .toList();
    }

    @PutMapping("/editar/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> editarCurso(
            @PathVariable Long id,
            @RequestPart("curso") CursoDTO cursoDTO,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        return ResponseEntity.ok(cursoService.editarCurso(id, cursoDTO, imagen));
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarCurso(@PathVariable Long id) {
        cursoService.eliminarCurso(id);
        return ResponseEntity.ok("Curso eliminado correctamente");
    }

    // Profesor agrega módulo con lecciones y materiales
    @PreAuthorize("hasRole('PROFESOR')")
    @PostMapping("/{cursoId}/modulos")
    public ResponseEntity<Curso> agregarModulo(
            @PathVariable Long cursoId,
            @RequestBody ModuloDTO moduloDTO,
            Authentication auth) {

        String username = auth.getName();
        Curso cursoActualizado = cursoService.agregarModulo(cursoId, moduloDTO, username);
        return ResponseEntity.ok(cursoActualizado);
    }

    // ADMIN: crear curso y asignar profesor
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Curso> crearCurso(@RequestBody Curso curso) {
        // Aquí deberías validar categoría, editor, etc.
        return ResponseEntity.ok(curso);
    }

    // Obtener curso completo (para que el profesor vea los módulos)
    @PreAuthorize("hasRole('PROFESOR')")
    @GetMapping("/{cursoId}")
    public ResponseEntity<Curso> obtenerCurso(@PathVariable Long cursoId, Authentication auth) {
        Curso curso = cursoService.getCursoPorId(cursoId);
        String username = auth.getName();
        if (!curso.getEditor().getNombre().equals(username)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(curso);
    }

}