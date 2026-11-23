package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "curso")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Long id;

    @Column(name = "nome_curso", nullable = false, length = 100)
    private String nomeCurso;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    public Curso() {}

    public Curso(Long id, String nomeCurso, String situacao) {
        this.id = id;
        this.nomeCurso = nomeCurso;
        this.situacao = situacao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeCurso() { return nomeCurso; }
    public void setNomeCurso(String nomeCurso) { this.nomeCurso = nomeCurso; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}