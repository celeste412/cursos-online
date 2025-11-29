package com.example.demo.service;

import com.example.demo.dto.CursoDTO;
import com.example.demo.mapper.CursoMapper;
import com.example.demo.model.Categoria;
import com.example.demo.model.Curso;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;
private final CategoriaRepository categoriaRepository;
private final UsuarioRepository usuarioRepository;

    /*public CursoDTO crearCurso(CursoDTO dto, MultipartFile imagen) throws IOException {
        Curso curso = new Curso();
        curso.setTitulo(dto.getTitulo());
        curso.setDescripcion(dto.getDescripcion());

        // Guardar imagen
        if (imagen != null && !imagen.isEmpty()) {
            String ruta = "uploads/" + imagen.getOriginalFilename();
            imagen.transferTo(new File(ruta));
            curso.setImagenUrl(ruta);
        }

        // Buscar categoría y editor
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        Usuario editor = usuarioRepository.findById(dto.getIdEditor())
                .orElseThrow(() -> new RuntimeException("Editor no encontrado"));

        curso.setCategoria(categoria);
        curso.setEditor(editor);

        return CursoMapper.toDTO(cursoRepository.save(curso));
    }*/

    public List<CursoDTO> listarCursos() {
        return cursoRepository.findAll()
                .stream()
                .map(CursoMapper::toDTO)
                .collect(Collectors.toList());
    }

    /*public CursoDTO obtenerCurso(Long id) {
        return cursoRepository.findById(id)
                .map(CursoMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    public CursoDTO editarCurso(Long id, Curso cursoActualizado) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        curso.setTitulo(cursoActualizado.getTitulo());
        curso.setDescripcion(cursoActualizado.getDescripcion());
        return CursoMapper.toDTO(cursoRepository.save(curso));
    }

    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso no encontrado con id " + id);
        }
        cursoRepository.deleteById(id);
    }*/

}
