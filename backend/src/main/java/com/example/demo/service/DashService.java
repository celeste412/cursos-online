package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.model.Curso;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashService {

    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;

    public Map<String, Long> obtenerTotales() {
        Map<String, Long> totales = new HashMap<>();

        long totalCursos = cursoRepository.count();
        long totalEstudiantes = usuarioRepository.findAllByRoles_NombreRol("ESTUDIANTE").size();
        long totalEditores = usuarioRepository.findAllByRoles_NombreRol("EDITOR").size();

        totales.put("totalCursos", totalCursos);
        totales.put("totalEstudiantes", totalEstudiantes);
        totales.put("totalEditores", totalEditores);

        return totales;
    }

     public List<Curso> obtenerUltimosCursos(int cantidad) {
        return cursoRepository.findAllByOrderByFechaCreacionDesc();
    }

    public List<Usuario> obtenerUltimosUsuarios(int cantidad) {
        return usuarioRepository.findAllByRoles_NombreRolOrderByIdDesc("ESTUDIANTE");
    }
}
