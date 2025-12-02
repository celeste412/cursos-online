package com.example.demo.service;

import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.EvaluacionDTO;
import com.example.demo.dto.LeccionDTO;
import com.example.demo.dto.MaterialDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.mapper.CursoMapper;
import com.example.demo.model.Categoria;
import com.example.demo.model.Curso;
import com.example.demo.model.EstadoInscripcion;
import com.example.demo.model.Evaluacion;
import com.example.demo.model.Inscripcion;
import com.example.demo.model.Leccion;
import com.example.demo.model.Material;
import com.example.demo.model.Modulo;
import com.example.demo.model.TipoMaterial;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.InscripcionRepository;
import com.example.demo.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final InscripcionRepository inscripcionRepository;

    // Ruta ABSOLUTA para guardar las imágenes
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public List<CursoDTO> listarCursos() {
        return cursoRepository.findAll()
                .stream()
                .map(CursoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CursoDTO crearCurso(CursoDTO dto, MultipartFile imagen) throws IOException {
        System.out.println("=== 🚀 CREANDO CURSO ===");
        System.out.println("Título: " + dto.getTitulo());
        System.out.println("Categoría ID: " + dto.getIdCategoria());
        System.out.println("Editor ID: " + dto.getIdEditor());
        System.out.println("Imagen: " + (imagen != null ? imagen.getOriginalFilename() : "null"));

        Curso curso = new Curso();
        curso.setTitulo(dto.getTitulo());
        curso.setDescripcion(dto.getDescripcion());

        // Guardar imagen
        if (imagen != null && !imagen.isEmpty()) {
            String nombreImagen = guardarImagen(imagen);
            curso.setImagenUrl("/uploads/" + nombreImagen);
            System.out.println("✅ Imagen guardada: " + nombreImagen);
        } else {
            curso.setImagenUrl("/uploads/default-course.png");
            System.out.println("⚠️  Usando imagen por defecto");
        }

        // Buscar categoría y editor
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        Usuario editor = usuarioRepository.findById(dto.getIdEditor())
                .orElseThrow(() -> new RuntimeException("Editor no encontrado"));

        curso.setCategoria(categoria);
        curso.setEditor(editor);

        Curso cursoGuardado = cursoRepository.save(curso);
        System.out.println("✅ Curso guardado con ID: " + cursoGuardado.getId());

        return CursoMapper.toDTO(cursoGuardado);
    }

    private String guardarImagen(MultipartFile imagen) throws IOException {
        // Crear directorio si no existe
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
            System.out.println("📁 Directorio creado: " + UPLOAD_DIR);
        }

        // Generar nombre único para evitar sobreescribir
        String extension = "";
        String originalFileName = imagen.getOriginalFilename();
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String nombreUnico = UUID.randomUUID().toString() + extension;
        String rutaCompleta = UPLOAD_DIR + nombreUnico;

        System.out.println("📸 Guardando imagen en: " + rutaCompleta);

        // Guardar la imagen
        imagen.transferTo(new File(rutaCompleta));

        return nombreUnico;
    }

    public Curso editarCurso(Long id, CursoDTO dto, MultipartFile imagen) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        curso.setTitulo(dto.getTitulo());
        curso.setDescripcion(dto.getDescripcion());

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        curso.setCategoria(categoria);

        Usuario editor = usuarioRepository.findById(dto.getIdEditor())
                .orElseThrow(() -> new RuntimeException("Editor no encontrado"));
        curso.setEditor(editor);

        // SI ENVÍAN NUEVA IMAGEN, SE ACTUALIZA
        if (imagen != null && !imagen.isEmpty()) {
            String nombreImagen = UUID.randomUUID() + "-" + imagen.getOriginalFilename();
            Path ruta = Paths.get("uploads/" + nombreImagen);

            try {
                Files.write(ruta, imagen.getBytes());
                curso.setImagenUrl("/uploads/" + nombreImagen);
            } catch (Exception e) {
                throw new RuntimeException("Error guardando imagen");
            }
        }

        return cursoRepository.save(curso);
    }

    public void eliminarCurso(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // eliminar imagen física
        if (curso.getImagenUrl() != null) {
            try {
                Path path = Paths.get("uploads", curso.getImagenUrl().replace("/uploads/", ""));
                Files.deleteIfExists(path);
            } catch (Exception ignored) {
            }
        }

        cursoRepository.delete(curso);
    }

    // Método que devuelve un curso por ID
    @Transactional(readOnly = true)
    public Curso getCursoPorId(Long cursoId) {
        return cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    // extra yooo

    @Transactional
    public Curso agregarModulo(Long cursoId, ModuloDTO moduloDTO, String usernameToken) {

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Usuario profesor = usuarioRepository.findByNombreUsuario(usernameToken)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!curso.getEditor().getId().equals(profesor.getId())) {
            throw new RuntimeException("No tienes permisos para modificar este curso.");
        }

        Modulo modulo = new Modulo();
        modulo.setTitulo(moduloDTO.getTitulo());
        modulo.setDescripcion(moduloDTO.getDescripcion());
        modulo.setCurso(curso);

        curso.getModulos().add(modulo);

        if (moduloDTO.getLecciones() != null) {
            modulo.setLecciones(new HashSet<>());

            for (LeccionDTO l : moduloDTO.getLecciones()) {
                Leccion leccion = new Leccion();
                leccion.setTitulo(l.getTitulo());
                leccion.setDescripcion(l.getDescripcion());
                leccion.setModulo(modulo);

                modulo.getLecciones().add(leccion);

                // MATERIALES
                if (l.getMateriales() != null) {
                    leccion.setMateriales(new HashSet<>());

                    for (MaterialDTO m : l.getMateriales()) {
                        Material mat = new Material();
                        mat.setTipo(TipoMaterial.valueOf(m.getTipo()));
                        mat.setUrl(m.getUrl());
                        mat.setLeccion(leccion);

                        leccion.getMateriales().add(mat);
                    }
                }

                // EVALUACIONES (QUIZ)
                if (l.getEvaluaciones() != null) {
                    leccion.setEvaluaciones(new HashSet<>());

                    for (EvaluacionDTO ev : l.getEvaluaciones()) {
                        Evaluacion e = new Evaluacion();
                        e.setPregunta(ev.getPregunta());
                        e.setOpcionA(ev.getOpcionA());
                        e.setOpcionB(ev.getOpcionB());
                        e.setOpcionC(ev.getOpcionC());
                        e.setOpcionD(ev.getOpcionD());
                        e.setRespuestaCorrecta(ev.getRespuestaCorrecta());
                        e.setLeccion(leccion);

                        leccion.getEvaluaciones().add(e);
                    }
                }
            }
        }

        return cursoRepository.save(curso);
    }

    @Transactional
    public CursoDTO agregarModuloDTO(Long cursoId, ModuloDTO moduloDTO, String usernameToken) {

        Curso cursoActualizado = agregarModulo(cursoId, moduloDTO, usernameToken);

        // Convertimos a DTO completo
        return CursoMapper.toDTO(cursoActualizado);
    }

    public MaterialDTO subirMaterial(Long cursoId, Long moduloId, Long leccionId, MultipartFile file)
            throws IOException {

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst().orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        Leccion leccion = modulo.getLecciones().stream()
                .filter(l -> l.getId().equals(leccionId))
                .findFirst().orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        // Guardar PDF físicamente
        String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        String nombreUnico = UUID.randomUUID() + extension;

        Path ruta = Paths.get("uploads/materiales/" + nombreUnico);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, file.getBytes());

        // Crear entidad Material
        Material material = new Material();
        material.setTipo(TipoMaterial.PDF);
        material.setUrl("/uploads/materiales/" + nombreUnico);
        material.setLeccion(leccion);

        leccion.getMateriales().add(material);
        cursoRepository.save(curso);

        return CursoMapper.toMaterialDTO(material);
    }

    @Transactional
    public ModuloDTO editarModulo(Long cursoId, Long moduloId, ModuloDTO dto, String username) {

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // ✔ Validación correcta con nombre_usuario
        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new RuntimeException("No tienes permisos para modificar este curso");
        }

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        modulo.setTitulo(dto.getTitulo());
        modulo.setDescripcion(dto.getDescripcion());

        cursoRepository.save(curso);

        return CursoMapper.toModuloDTO(modulo);
    }

    @Transactional
    public void eliminarModuloSeguro(Long cursoId, Long moduloId, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos");
        }

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        // TODO: Aquí deberías validar si hay estudiantes inscritos / intentos
        boolean usadoPorEstudiantes = false; // reemplazar con tu lógica real
        if (usadoPorEstudiantes) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar el módulo: ya tiene actividad de estudiantes.");
        }

        curso.getModulos().remove(modulo);
        cursoRepository.save(curso);
    }

    @Transactional
    public void eliminarLeccionSeguro(Long cursoId, Long moduloId, Long leccionId, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos");
        }

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        Leccion leccion = modulo.getLecciones().stream()
                .filter(l -> l.getId().equals(leccionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        boolean usadoPorEstudiantes = false; // TODO lógica real
        if (usadoPorEstudiantes) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar la lección: ya tiene actividad de estudiantes.");
        }

        modulo.getLecciones().remove(leccion);
        cursoRepository.save(curso);
    }

    @Transactional
    public void eliminarMaterialSeguro(Long cursoId, Long moduloId, Long leccionId, Long materialId, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos");
        }

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        Leccion leccion = modulo.getLecciones().stream()
                .filter(l -> l.getId().equals(leccionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        Material material = leccion.getMateriales().stream()
                .filter(m -> m.getId().equals(materialId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        boolean usadoPorEstudiantes = false; // TODO lógica real
        if (usadoPorEstudiantes) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar el material: ya fue utilizado por estudiantes.");
        }

        leccion.getMateriales().remove(material);
        cursoRepository.save(curso);

        // Opcional: borrar archivo físico si quieres
    }

    @Transactional
    public void eliminarEvaluacionSeguro(Long cursoId, Long moduloId, Long leccionId, Long evaluacionId,
            String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos");
        }

        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        Leccion leccion = modulo.getLecciones().stream()
                .filter(l -> l.getId().equals(leccionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));

        Evaluacion evaluacion = leccion.getEvaluaciones().stream()
                .filter(e -> e.getId().equals(evaluacionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));

        boolean respondida = false; // TODO lógica real
        if (respondida) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar la evaluación: ya fue respondida por estudiantes.");
        }

        leccion.getEvaluaciones().remove(evaluacion);
        cursoRepository.save(curso);
    }

    // nuevos
    // NUEVO: Crear lección
    @Transactional
    public LeccionDTO crearLeccion(Long cursoId, Long moduloId, LeccionDTO dto, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new RuntimeException("No tienes permisos para modificar este curso.");
        }
        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst().orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        Leccion leccion = new Leccion();
        leccion.setTitulo(dto.getTitulo());
        leccion.setDescripcion(dto.getDescripcion());
        leccion.setModulo(modulo);
        modulo.getLecciones().add(leccion);
        cursoRepository.save(curso);
        return CursoMapper.toLeccionDTO(leccion);
    }

    // NUEVO: Editar lección
    @Transactional
    public LeccionDTO editarLeccion(Long cursoId, Long moduloId, Long leccionId, LeccionDTO dto, String username) {
        Leccion leccion = getLeccion(cursoId, moduloId, leccionId, username);
        leccion.setTitulo(dto.getTitulo());
        leccion.setDescripcion(dto.getDescripcion());
        cursoRepository.save(leccion.getModulo().getCurso());
        return CursoMapper.toLeccionDTO(leccion);
    }

    // NUEVO: Crear material con URL
    @Transactional
    public MaterialDTO crearMaterialUrl(Long cursoId, Long moduloId, Long leccionId, MaterialDTO dto, String username) {
        Leccion leccion = getLeccion(cursoId, moduloId, leccionId, username);
        Material material = new Material();
        material.setTipo(TipoMaterial.valueOf(dto.getTipo()));
        material.setUrl(dto.getUrl());
        material.setLeccion(leccion);
        leccion.getMateriales().add(material);
        cursoRepository.save(leccion.getModulo().getCurso());
        return CursoMapper.toMaterialDTO(material);
    }

    // NUEVO: Crear evaluación
    @Transactional
    public EvaluacionDTO crearEvaluacion(Long cursoId, Long moduloId, Long leccionId, EvaluacionDTO dto,
            String username) {
        Leccion leccion = getLeccion(cursoId, moduloId, leccionId, username);
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setPregunta(dto.getPregunta());
        evaluacion.setOpcionA(dto.getOpcionA());
        evaluacion.setOpcionB(dto.getOpcionB());
        evaluacion.setOpcionC(dto.getOpcionC());
        evaluacion.setOpcionD(dto.getOpcionD());
        evaluacion.setRespuestaCorrecta(dto.getRespuestaCorrecta());
        evaluacion.setLeccion(leccion);
        leccion.getEvaluaciones().add(evaluacion);
        cursoRepository.save(leccion.getModulo().getCurso());
        return CursoMapper.toEvaluacionDTO(evaluacion);
    }

    // MÉTODO AUXILIAR: Obtener lección con validaciones
    private Leccion getLeccion(Long cursoId, Long moduloId, Long leccionId, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        if (!curso.getEditor().getNombreUsuario().equals(username)) {
            throw new RuntimeException("No tienes permisos");
        }
        Modulo modulo = curso.getModulos().stream()
                .filter(m -> m.getId().equals(moduloId))
                .findFirst().orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        return modulo.getLecciones().stream()
                .filter(l -> l.getId().equals(leccionId))
                .findFirst().orElseThrow(() -> new RuntimeException("Lección no encontrada"));
    }

    public CursoDTO obtenerCursoDTO(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        return CursoMapper.toDTO(curso);
    }

    @Transactional
    public void inscribirEstudiante(Long idCurso, String username) {

        Usuario estudiante = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // verificar duplicado
        if (inscripcionRepository.existsByCursoIdAndUsuarioId(idCurso, estudiante.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya estás inscrito");
        }

        Inscripcion insc = new Inscripcion();
        insc.setCurso(curso);
        insc.setUsuario(estudiante);
        insc.setEstado(EstadoInscripcion.ACTIVO);
        insc.setFechaInscripcion(LocalDateTime.now());

        inscripcionRepository.save(insc);
    }

    public boolean estaInscrito(Long idCurso, String username) {

        Usuario estudiante = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return inscripcionRepository.existsByCursoIdAndUsuarioId(idCurso, estudiante.getId());
    }

}