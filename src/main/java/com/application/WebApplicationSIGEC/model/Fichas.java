package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "ficha")
public class Fichas implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha")
    private Integer id;

    @Column(name = "nome_ficha", nullable = false, length = 100)
    private String nomeFicha;

    @Column(columnDefinition = "TEXT")
    private String preparo;

    @Column(name = "situacao", nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma")
    @JsonIgnoreProperties("fichas")
    private Turmas turma;

    @OneToMany(mappedBy = "ficha", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("ficha")
    private List<Insumos> insumos;

    public Fichas() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeFicha() { return nomeFicha; }
    public void setNomeFicha(String nomeFicha) { this.nomeFicha = nomeFicha; }

    public String getPreparo() { return preparo; }
    public void setPreparo(String preparo) { this.preparo = preparo; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Turmas getTurma() { return turma; }
    public void setTurma(Turmas turma) { this.turma = turma; }

    public List<Insumos> getInsumos() { return insumos; }
    public void setInsumos(List<Insumos> insumos) { this.insumos = insumos; }
}