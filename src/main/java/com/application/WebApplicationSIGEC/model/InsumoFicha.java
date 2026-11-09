package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

/**
 * Ingredientes de uma ficha técnica (tabela insumo_ficha).
 * A ficha é identificada por insumo_ficha.id_ficha, o mesmo id_ficha
 * que aparece em turma_ficha e agendamento.
 */
@Entity
@Table(name = "insumo_ficha")
public class InsumoFicha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo_ficha")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_ficha", nullable = false)
    private Ficha ficha;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    // Quantidade necessária na receita
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "unidade_medida", length = 5)
    private String unidadeMedida;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }
}