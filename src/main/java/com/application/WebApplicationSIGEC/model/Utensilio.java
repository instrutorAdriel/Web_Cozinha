package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utensilio")
public class Utensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utensilio")
    private Long id;

    @Column(name = "nome_utensilio", nullable = false, length = 100)
    private String nomeUtensilio;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "numero_patrimonio", nullable = false)
    private Integer numeroPatrimonio;

    @Column(length = 255)
    private String observacao;

    @Column(name = "situacao", nullable = false, length = 1)
    private char situacao = 'A';

    public Utensilio() {
    }

    public Utensilio(String nomeUtensilio, Integer quantidade, Integer numeroPatrimonio, String observacao) {
        this.nomeUtensilio = nomeUtensilio;
        this.quantidade = quantidade;
        this.numeroPatrimonio = numeroPatrimonio;
        this.observacao = observacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeUtensilio() {
        return nomeUtensilio;
    }

    public void setNomeUtensilio(String nomeUtensilio) {
        this.nomeUtensilio = nomeUtensilio;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Integer getNumeroPatrimonio() {
        return numeroPatrimonio;
    }

    public void setNumeroPatrimonio(Integer numeroPatrimonio) {
        this.numeroPatrimonio = numeroPatrimonio;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public char getSituacao() {
        return situacao;
    }

    public void setSituacao(char situacao) {
        this.situacao = situacao;
    }
}