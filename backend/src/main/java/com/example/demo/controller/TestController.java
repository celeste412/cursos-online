package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRADOR')")
    public String adminAccess() {
        return "Acceso permitido al ADMINISTRADOR";
    }

    @GetMapping("/editor")
    @PreAuthorize("hasAuthority('ROLE_EDITOR')")
    public String editorAccess() {
        return "Acceso permitido al EDITOR";
    }

    @GetMapping("/estudiante")
    @PreAuthorize("hasAuthority('ROLE_ESTUDIANTE')")
    public String estudianteAccess() {
        return "Acceso permitido al ESTUDIANTE";
    }

    @GetMapping("/publico")
    public String publico() {
        return "Endpoint público sin autenticación";
    }
}
