package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;


@Entity
@Table(name = "laboratorio")
public class Laboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_laboratorio")
    private Integer idLaboratorio;

    @Column(name = "nome_laboratorio", nullable = false, length = 55)
    private String nomeLaboratorio;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidade")
    private Unidade unidade;

    public Laboratorio() {}

    // Getters e Setters

    public Integer getIdLaboratorio() {
        return idLaboratorio;
    }

    public void setIdLaboratorio(Integer idLaboratorio) {
        this.idLaboratorio = idLaboratorio;
    }

    public String getNomeLaboratorio() { return nomeLaboratorio; }
    public void setNomeLaboratorio(String nomeLaboratorio) { this.nomeLaboratorio = nomeLaboratorio; }
    public Integer getCapacidade() { return capacidade; }
    public void setCapacidade(Integer capacidade) { this.capacidade = capacidade; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }
}