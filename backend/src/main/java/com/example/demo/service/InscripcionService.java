package com.example.demo.service;

import com.example.demo.dto.InscripcionDTO;
import com.example.demo.mapper.InscripcionMapper;
import com.example.demo.model.Curso;
import com.example.demo.model.Inscripcion;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.InscripcionRepository;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;

    public InscripcionDTO inscribir(Long usuarioId, Long cursoId) {

        if (inscripcionRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId).isPresent()) {
            throw new RuntimeException("El usuario ya está inscrito en este curso");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Inscripcion inscripcion = Inscripcion.builder()
                .usuario(usuario)
                .curso(curso)
                .build();

        Inscripcion guardada = inscripcionRepository.save(inscripcion);

        return InscripcionMapper.toDTO(guardada);
    }

    public List<InscripcionDTO> listarCursosDeUsuario(Long usuarioId) {
        return inscripcionRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(InscripcionMapper::toDTO)
                .toList();
    }
}
