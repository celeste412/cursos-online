package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.CursoAvanceDTO;
import com.example.demo.dto.UsuarioRecienteDTO;
import com.example.demo.model.Curso;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.DashboardRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashService {

    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DashboardRepository dashboardRepository;

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

    // YO

    public List<CursoAvanceDTO> obtenerAvancePromedioCursos() {
        List<Object[]> rows = dashboardRepository.obtenerAvancePromedioPorCursoRaw();

        return rows.stream()
                .map(r -> new CursoAvanceDTO(
                        ((Number) r[0]).intValue(),
                        (String) r[1],
                        r[2] != null ? ((Number) r[2]).doubleValue() : 0.0))
                .collect(Collectors.toList());
    }

    public List<UsuarioRecienteDTO> obtenerUltimosEstudiantes(int limit) {

        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);

        List<Object[]> rows = usuarioRepository.findUltimosEstudiantes(
                "ESTUDIANTE",
                pageable);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return rows.stream()
                .map(r -> {
                    Integer id = ((Number) r[0]).intValue();
                    String nombre = (String) r[1];
                    String apellido = (String) r[2];
                    String username = (String) r[3];
                    String rol = (String) r[4];
                    LocalDateTime fecha = (LocalDateTime) r[5];

                    String nombreMostrar;
                    if (nombre != null && apellido != null) {
                        nombreMostrar = nombre + " " + apellido;
                    } else if (nombre != null) {
                        nombreMostrar = nombre;
                    } else {
                        nombreMostrar = username;
                    }

                    String fechaTexto = fecha.toLocalDate().format(formatter);

                    return new UsuarioRecienteDTO(id, nombreMostrar, rol, fechaTexto);
                })
                .collect(Collectors.toList());
    }

}
