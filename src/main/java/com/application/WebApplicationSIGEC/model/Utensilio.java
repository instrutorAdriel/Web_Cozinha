package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utensilio")
public class Utensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utensilio")
    private Integer idUtensilio;

    @Column(name = "nome_utensilio", nullable = false, length = 100)
    private String nomeUtensilio;

    @Column(nullable = false)
    private Integer quantidade = 0;

    @Column(name = "numero_patrimonio", nullable = false)
    private Integer numeroPatrimonio;

    @Column(length = 255)
    private String observacao;

    @Column(nullable = false, length = 1)
    private String situacao = "A";


    public Utensilio() {}

    // Getters e Setters

    public Integer getIdUtensilio() {
        return idUtensilio;
    }

    public void setIdUtensilio(Integer idUtensilio) {
        this.idUtensilio = idUtensilio;
    }

    public String getNomeUtensilio() { return nomeUtensilio; }
    public void setNomeUtensilio(String nomeUtensilio) { this.nomeUtensilio = nomeUtensilio; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public Integer getNumeroPatrimonio() { return numeroPatrimonio; }
    public void setNumeroPatrimonio(Integer numeroPatrimonio) { this.numeroPatrimonio = numeroPatrimonio; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}