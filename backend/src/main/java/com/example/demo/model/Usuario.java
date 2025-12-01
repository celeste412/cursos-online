package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombre", length = 50)
    private String nombre;

    @Column(name = "apellido", length = 50)
    private String apellido;

    @Column(name = "nombre_usuario", nullable = false, unique = true, length = 50)
    private String nombreUsuario;

    // Cambiado de 'contrasena' a 'password'
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "fecha_creacion", updatable = false, insertable = false)
    private LocalDateTime fechaCreacion;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuarios_roles", 
               joinColumns = @JoinColumn(name = "id_usuario"), 
               inverseJoinColumns = @JoinColumn(name = "id_rol"))
    @Builder.Default
    private Set<Rol> roles = new HashSet<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<Inscripcion> inscripciones = new HashSet<>();

    // AGREGA ESTA RELACIÓN para cursos como editor
    @OneToMany(mappedBy = "editor", fetch = FetchType.LAZY)
    @JsonIgnore // ← AGREGA ESTO
    @Builder.Default
    private Set<Curso> cursosEditados = new HashSet<>();
}
