package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "curso_ficha", uniqueConstraints = {
        @UniqueConstraint(name = "uk_curso_ficha", columnNames = {"id_curso", "id_ficha"})
})
public class CursoFicha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso_ficha")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ficha", nullable = false)
    private Ficha ficha;

    public CursoFicha() {}

    public CursoFicha(Curso curso, Ficha ficha) {
        this.curso = curso;
        this.ficha = ficha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }
}