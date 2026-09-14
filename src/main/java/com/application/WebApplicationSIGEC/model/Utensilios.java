package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "utensilio")
public class Utensilios implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utensilio")
    private Integer id;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria_utensilio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CategoriaUtensilio categoriaUtensilio;

    public Utensilios() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public CategoriaUtensilio getCategoriaUtensilio() { return categoriaUtensilio; }
    public void setCategoriaUtensilio(CategoriaUtensilio categoriaUtensilio) { this.categoriaUtensilio = categoriaUtensilio; }
}