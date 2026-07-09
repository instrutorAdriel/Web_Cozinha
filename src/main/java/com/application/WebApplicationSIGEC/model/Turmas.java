package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuarios_turmas",
            joinColumns = @JoinColumn(name = "turmas", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "usuarios", referencedColumnName = "id")
    )
    @JsonIgnoreProperties("turmas") // Evita loop ao serializar a lista de usuários da turma
    private List<Usuario> usuarios;

    // Dentro de Turmas.java

    @ManyToMany(mappedBy = "turmas", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("turmas")
    private List<Fichas> fichas;

    public Turmas() {
    }

    public Turmas(String nomeTurma, String laboratorio) {
        this.nomeTurma = nomeTurma;
        this.laboratorio = laboratorio;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

    public List<Fichas> getFichas() {
        return fichas;
    }

    public void setFichas(List<Fichas> fichas) {
        this.fichas = fichas;
    }
}