package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ManyToAny;


@Entity
@Table(name = "turmas")
public class Turmas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nome_turma", nullable = false, unique = true)
    private String nomeTurma;

    @Column(nullable = false)
    private String laboratorio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuarios",referencedColumnName = "id", nullable = false)
    private Usuario usuarios;

    public Turmas() {
    }

    public Turmas(String nomeTurma, String laboratorio) {
        this.nomeTurma = nomeTurma;
        this.laboratorio = laboratorio;
    }

    public String getNomeTurma() {
        return nomeTurma;
    }

    public void setNomeTurma(String nomeTurma) {
        this.nomeTurma = nomeTurma;
    }

    public String getLaboratorio() {
        return laboratorio;
    }

    public void setLaboratorio(String laboratorio) {
        this.laboratorio = laboratorio;
    }

    public Usuario getUsuarios() {
        return usuarios;
    }
}
