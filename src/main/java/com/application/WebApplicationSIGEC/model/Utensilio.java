package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "utensilio")
public class Utensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utensilio")
    private Long id;

    @Column(name = "nome_utensilio", nullable = false, length = 55)
    private String nomeUtensilio;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "numero_patrimonio", length = 45)
    private String numeroPatrimonio;

    @Column(length = 255)
    private String observacao;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria_utensilio")
    private CategoriaUtensilio categoriaUtensilio;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_laboratorio")
    private Laboratorio laboratorio;

    public Utensilio() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeUtensilio() { return nomeUtensilio; }
    public void setNomeUtensilio(String nomeUtensilio) { this.nomeUtensilio = nomeUtensilio; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public String getNumeroPatrimonio() { return numeroPatrimonio; }
    public void setNumeroPatrimonio(String numeroPatrimonio) { this.numeroPatrimonio = numeroPatrimonio; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public CategoriaUtensilio getCategoriaUtensilio() { return categoriaUtensilio; }
    public void setCategoriaUtensilio(CategoriaUtensilio categoriaUtensilio) { this.categoriaUtensilio = categoriaUtensilio; }
    public Laboratorio getLaboratorio() { return laboratorio; }
    public void setLaboratorio(Laboratorio laboratorio) { this.laboratorio = laboratorio; }
}