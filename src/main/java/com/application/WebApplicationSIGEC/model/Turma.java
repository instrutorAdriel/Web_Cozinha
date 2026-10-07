package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma")
    private int idTurma;

    @Column(name = "nome_turma", nullable = false, length = 55)
    private String nomeTurma;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_laboratorio")
    private Laboratorio laboratorio;

    public Turma() {}

    // Getters e Setters

    public int getIdTurma() {
        return idTurma;
    }

    public void setIdTurma(int idTurma) {
        this.idTurma = idTurma;
    }

    public String getNomeTurma() { return nomeTurma; }
    public void setNomeTurma(String nomeTurma) { this.nomeTurma = nomeTurma; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public Laboratorio getLaboratorio() { return laboratorio; }
    public void setLaboratorio(Laboratorio laboratorio) { this.laboratorio = laboratorio; }
}