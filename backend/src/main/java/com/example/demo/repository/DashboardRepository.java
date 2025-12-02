package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.Curso;

public interface DashboardRepository extends JpaRepository<Curso, Integer> {
    @Query(value = """
            SELECT
                c.id_curso                            AS idCurso,
                c.titulo                              AS titulo,
                COALESCE(ROUND(
                    (
                       COUNT(DISTINCT CASE
                           WHEN p.completado = 1
                           THEN CONCAT(p.id_usuario,'-',p.id_leccion)
                       END)
                    ) / NULLIF(COUNT(DISTINCT l.id_leccion) * COUNT(DISTINCT i.id_usuario), 0) * 100
                , 2), 0)                               AS avancePromedio
            FROM cursos c
            JOIN modulos m      ON m.id_curso = c.id_curso
            JOIN lecciones l    ON l.id_modulo = m.id_modulo
            JOIN inscripciones i ON i.id_curso = c.id_curso AND i.estado = 'ACTIVO'
            LEFT JOIN progreso p ON p.id_leccion = l.id_leccion AND p.id_usuario = i.id_usuario
            GROUP BY c.id_curso, c.titulo
            """, nativeQuery = true)
    List<Object[]> obtenerAvancePromedioPorCursoRaw();
}
