package com.example.demo.service;

import com.example.demo.dto.ProgresoDTO;
import com.example.demo.model.Leccion;
import com.example.demo.model.Progreso;
import com.example.demo.model.Usuario;
import com.example.demo.repository.LeccionRepository;
import com.example.demo.repository.ProgresoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class ProgresoService {

    private final ProgresoRepository progresoRepository;
    private final LeccionRepository leccionRepository;
    private final UsuarioRepository usuarioRepository;

    public ProgresoService(ProgresoRepository progresoRepository, 
                           LeccionRepository leccionRepository, 
                           UsuarioRepository usuarioRepository) {
        this.progresoRepository = progresoRepository;
        this.leccionRepository = leccionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Obtener progreso de un estudiante en una lección
    public ProgresoDTO obtenerProgreso(Long usuarioId, Long leccionId) {
        Progreso progreso = progresoRepository.findByUsuarioIdAndLeccionId(usuarioId, leccionId)
                .orElseThrow(() -> new RuntimeException("Progreso no encontrado"));

        return new ProgresoDTO(progreso.getId(), progreso.getUsuario().getId(), 
                progreso.getLeccion().getId(), progreso.isCompletado());
    }

    // Crear o actualizar progreso de un estudiante en una lección
    public ProgresoDTO actualizarProgreso(Long usuarioId, Long leccionId, ProgresoDTO progresoDTO) {
        // Verificamos que la lección y el usuario existan
        Leccion leccion = leccionRepository.findById(leccionId)
                .orElseThrow(() -> new RuntimeException("Lección no encontrada"));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificamos si ya existe un progreso registrado para esta lección y usuario
        Progreso progreso = progresoRepository.findByUsuarioIdAndLeccionId(usuarioId, leccionId)
                .orElse(new Progreso()); // Si no existe, lo creamos nuevo

        // Actualizamos los valores
        progreso.setLeccion(leccion);
        progreso.setUsuario(usuario);
        progreso.setCompletado(progresoDTO.isCompletado());

        // Guardamos o actualizamos el progreso
        Progreso guardado = progresoRepository.save(progreso);

        return new ProgresoDTO(guardado.getId(), guardado.getUsuario().getId(), 
                guardado.getLeccion().getId(), guardado.isCompletado());
    }
}
