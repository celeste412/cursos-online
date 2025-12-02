package com.example.demo.dto;

public class CursoAvanceDTO {
    private Integer idCurso;
    private String titulo;
    private Double avancePromedio; // 0 a 100

    public CursoAvanceDTO(Integer idCurso, String titulo, Double avancePromedio) {
        this.idCurso = idCurso;
        this.titulo = titulo;
        this.avancePromedio = avancePromedio;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public String getTitulo() {
        return titulo;
    }

    public Double getAvancePromedio() {
        return avancePromedio;
    }
}
