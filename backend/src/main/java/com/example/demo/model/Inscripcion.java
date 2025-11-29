package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscripcion")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(name = "fecha_inscripcion")
    private LocalDateTime fechaInscripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoInscripcion estado;

    @PrePersist
    protected void onCreate() {
        this.fechaInscripcion = LocalDateTime.now();
        this.estado = EstadoInscripcion.ACTIVO;
    }
}
