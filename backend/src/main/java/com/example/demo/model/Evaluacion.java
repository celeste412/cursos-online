package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long id;

    @Column(nullable = false)
    private String pregunta;

    @Column(name = "opcion_a")
    private String opcionA;

    @Column(name = "opcion_b")
    private String opcionB;

    @Column(name = "opcion_c")
    private String opcionC;

    @Column(name = "opcion_d")
    private String opcionD;

    @Column(name = "respuesta_correcta", nullable = false)
    private String respuestaCorrecta;

    @ManyToOne
    @JoinColumn(name = "id_leccion", nullable = false)
    private Leccion leccion;
}
