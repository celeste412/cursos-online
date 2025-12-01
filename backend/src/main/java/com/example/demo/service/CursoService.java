package com.example.demo.service;

import com.example.demo.dto.CursoDTO;
import com.example.demo.dto.LeccionDTO;
import com.example.demo.dto.MaterialDTO;
import com.example.demo.dto.ModuloDTO;
import com.example.demo.mapper.CursoMapper;
import com.example.demo.model.Categoria;
import com.example.demo.model.Curso;
import com.example.demo.model.Leccion;
import com.example.demo.model.Material;
import com.example.demo.model.Modulo;
import com.example.demo.model.TipoMaterial;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @Transactional
    public Curso agregarModulo(Long cursoId, ModuloDTO moduloDTO, String username) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // Verificar que el usuario sea el profesor asignado
        if (!curso.getEditor().getNombre().equals(username)) {
            throw new RuntimeException("No tienes permisos para modificar este curso");
        }

        // Crear módulo
        Modulo modulo = Modulo.builder()
                .titulo(moduloDTO.getTitulo())
                .descripcion(moduloDTO.getDescripcion())
                .curso(curso)
                .lecciones(new HashSet<>())
                .build();

        // Convertir Lecciones
        if (moduloDTO.getLecciones() != null) {
            for (LeccionDTO lDTO : moduloDTO.getLecciones()) {
                Leccion leccion = Leccion.builder()
                        .titulo(lDTO.getTitulo())
                        .descripcion(lDTO.getDescripcion())
                        .modulo(modulo)
                        .materiales(new HashSet<>())
                        .evaluaciones(new HashSet<>())
                        .build();

                // Convertir Materiales
                if (lDTO.getMateriales() != null) {
                    for (MaterialDTO mDTO : lDTO.getMateriales()) {
                        Material material = Material.builder()
                                .tipo(TipoMaterial.valueOf(mDTO.getTipo()))
                                .url(mDTO.getUrl())
                                .leccion(leccion)
                                .build();
                        leccion.getMateriales().add(material);
                    }
                }

                modulo.getLecciones().add(leccion);
            }
        }

        curso.getModulos().add(modulo);

        return cursoRepository.save(curso);
    }

}