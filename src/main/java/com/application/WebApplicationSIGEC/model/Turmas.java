package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "turma")
public class Turmas implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma")
    private Integer id;

    @Column(name = "nome_turma", nullable = false, length = 55)
    private String nomeTurma;

    @Column(name = "situacao", nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_laboratorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Laboratorio laboratorio;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuario_turma",
            joinColumns = @JoinColumn(name = "id_turma"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    @JsonIgnoreProperties("turmas")
    private List<Usuario> usuarios;

    @OneToMany(mappedBy = "turma", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("turma")
    private List<Fichas> fichas;

    public Turmas() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeTurma() { return nomeTurma; }
    public void setNomeTurma(String nomeTurma) { this.nomeTurma = nomeTurma; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Laboratorio getLaboratorio() { return laboratorio; }
    public void setLaboratorio(Laboratorio laboratorio) { this.laboratorio = laboratorio; }

    public List<Usuario> getUsuarios() { return usuarios; }
    public void setUsuarios(List<Usuario> usuarios) { this.usuarios = usuarios; }

    public List<Fichas> getFichas() { return fichas; }
    public void setFichas(List<Fichas> fichas) { this.fichas = fichas; }
}