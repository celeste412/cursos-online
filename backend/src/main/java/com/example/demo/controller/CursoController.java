package com.example.demo.controller;

import com.example.demo.dto.CategoriaDTO;
import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.dto.LeccionDTO;
import com.example.demo.dto.MaterialDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.dto.UsuarioDTO;
import com.example.demo.mapper.CursoMapper;
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

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','ESTUDIANTE')")
    @GetMapping("/publicos")
    public ResponseEntity<List<CursoDTO>> listarCursosPublicos() {
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

    // ADMIN: crear curso y asignar profesor
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Curso> crearCurso(@RequestBody Curso curso) {
        // Aquí deberías validar categoría, editor, etc.
        return ResponseEntity.ok(curso);
    }

    // Obtener curso completo con módulos, lecciones y materiales
    @PreAuthorize("hasRole('EDITOR')")
    @GetMapping("/{cursoId}/editor")
    public ResponseEntity<CursoDTO> obtenerCurso(
            @PathVariable Long cursoId,
            Authentication auth) {

        Curso curso = cursoService.getCursoPorId(cursoId);

        // Seguridad: validar que el editor sea el dueño del curso
        if (!curso.getEditor().getNombreUsuario().equals(auth.getName())) {
            return ResponseEntity.status(403).build();
        }

        // Devolver DTO completo
        return ResponseEntity.ok(CursoMapper.toDTO(curso));
    }

    // Profesor agrega módulo con lecciones + materiales
    @PreAuthorize("hasRole('EDITOR')")
    @PostMapping("/{cursoId}/modulos")
    public ResponseEntity<CursoDTO> agregarModulo(
            @PathVariable Long cursoId,
            @RequestBody ModuloDTO moduloDTO,
            Authentication auth) {

        String username = auth.getName();
        CursoDTO cursoActualizado = cursoService.agregarModuloDTO(cursoId, moduloDTO, username);

        return ResponseEntity.ok(cursoActualizado);
    }

    // SUBIR MATERIAL PDF
    @PreAuthorize("hasRole('EDITOR')")
    @PostMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}/materiales")
    public ResponseEntity<MaterialDTO> subirMaterial(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @RequestParam("file") MultipartFile archivo) throws IOException {

        MaterialDTO material = cursoService.subirMaterial(cursoId, moduloId, leccionId, archivo);
        return ResponseEntity.ok(material);
    }

    // EDITAR MÓDULO
    @PutMapping("/{cursoId}/modulos/{moduloId}")
    public ResponseEntity<CursoDTO> editarModulo(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @RequestBody ModuloDTO dto,
            Authentication auth) {

        cursoService.editarModulo(cursoId, moduloId, dto, auth.getName());

        // Devuelve curso COMPLETO, no solo módulo
        Curso curso = cursoService.getCursoPorId(cursoId);

        return ResponseEntity.ok(CursoMapper.toDTO(curso));
    }

    // ELIMINAR
    @PreAuthorize("hasRole('EDITOR')")
    @DeleteMapping("/{cursoId}/modulos/{moduloId}")
    public ResponseEntity<Void> eliminarModulo(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            Authentication auth) {

        cursoService.eliminarModuloSeguro(cursoId, moduloId, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('EDITOR')")
    @DeleteMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}")
    public ResponseEntity<Void> eliminarLeccion(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            Authentication auth) {

        cursoService.eliminarLeccionSeguro(cursoId, moduloId, leccionId, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('EDITOR')")
    @DeleteMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}/materiales/{materialId}")
    public ResponseEntity<Void> eliminarMaterial(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @PathVariable Long materialId,
            Authentication auth) {

        cursoService.eliminarMaterialSeguro(cursoId, moduloId, leccionId, materialId, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('EDITOR')")
    @DeleteMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}/evaluaciones/{evaluacionId}")
    public ResponseEntity<Void> eliminarEvaluacion(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @PathVariable Long evaluacionId,
            Authentication auth) {

        cursoService.eliminarEvaluacionSeguro(cursoId, moduloId, leccionId, evaluacionId, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // EXTRAS
    @PreAuthorize("hasRole('EDITOR')")
    @PostMapping("/{cursoId}/modulos/{moduloId}/lecciones")
    public ResponseEntity<LeccionDTO> crearLeccion(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @RequestBody LeccionDTO dto,
            Authentication auth) {
        LeccionDTO leccion = cursoService.crearLeccion(cursoId, moduloId, dto, auth.getName());
        return ResponseEntity.ok(leccion);
    }

    // NUEVO: Editar lección
    @PreAuthorize("hasRole('EDITOR')")
    @PutMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}")
    public ResponseEntity<LeccionDTO> editarLeccion(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @RequestBody LeccionDTO dto,
            Authentication auth) {
        LeccionDTO leccion = cursoService.editarLeccion(cursoId, moduloId, leccionId, dto, auth.getName());
        return ResponseEntity.ok(leccion);
    }

    // NUEVO: Crear material con URL (para videos)
    @PreAuthorize("hasRole('EDITOR')")
    @PostMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}/materiales/url")
    public ResponseEntity<MaterialDTO> crearMaterialUrl(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @RequestBody MaterialDTO dto,
            Authentication auth) {
        MaterialDTO material = cursoService.crearMaterialUrl(cursoId, moduloId, leccionId, dto, auth.getName());
        return ResponseEntity.ok(material);
    }

    // NUEVO: Crear evaluación (quiz)
    @PreAuthorize("hasRole('EDITOR')")
    @PostMapping("/{cursoId}/modulos/{moduloId}/lecciones/{leccionId}/evaluaciones")
    public ResponseEntity<EvaluacionDTO> crearEvaluacion(
            @PathVariable Long cursoId,
            @PathVariable Long moduloId,
            @PathVariable Long leccionId,
            @RequestBody EvaluacionDTO dto,
            Authentication auth) {
        EvaluacionDTO evaluacion = cursoService.crearEvaluacion(cursoId, moduloId, leccionId, dto, auth.getName());
        return ResponseEntity.ok(evaluacion);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.obtenerCursoDTO(id));
    }

    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PostMapping("/{id}/inscribir")
    public ResponseEntity<?> inscribir(
            @PathVariable Long id,
            Authentication auth) {

        String username = auth.getName();

        cursoService.inscribirEstudiante(id, username);

        return ResponseEntity.ok("Inscrito correctamente");
    }

    @PreAuthorize("hasRole('ESTUDIANTE')")
    @GetMapping("/{id}/inscrito")
    public ResponseEntity<Boolean> verificarInscripcion(
            @PathVariable Long id,
            Authentication auth) {

        String username = auth.getName();

        boolean inscrito = cursoService.estaInscrito(id, username);

        return ResponseEntity.ok(inscrito);
    }

}