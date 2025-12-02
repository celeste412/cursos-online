package com.example.demo.dto;

public class UsuarioRecienteDTO {
    private Integer id;
    private String nombreMostrar; // "Nombre Apellido" o nombre_usuario
    private String rol; // "ESTUDIANTE"
    private String fechaRegistro; // opcional texto

    public UsuarioRecienteDTO(Integer id, String nombreMostrar, String rol, String fechaRegistro) {
        this.id = id;
        this.nombreMostrar = nombreMostrar;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
    }

    public Integer getId() {
        return id;
    }

    public String getNombreMostrar() {
        return nombreMostrar;
    }

    public String getRol() {
        return rol;
    }

    public String getFechaRegistro() {
        return fechaRegistro;
    }
}
