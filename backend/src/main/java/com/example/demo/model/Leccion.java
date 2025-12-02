package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lecciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_leccion")
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(length = 500)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo", nullable = false)
    private Modulo modulo;

    @OneToMany(mappedBy = "leccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Material> materiales = new HashSet<>();

    @OneToMany(mappedBy = "leccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Evaluacion> evaluaciones = new HashSet<>();
}
