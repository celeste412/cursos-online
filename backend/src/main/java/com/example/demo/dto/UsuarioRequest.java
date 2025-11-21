package com.example.demo.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombreUsuario;
    private String password;
    private String rol;
}
