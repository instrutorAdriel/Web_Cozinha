package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Estoque de insumos: um registro por lote (tabela insumo).
 * Não tem mais vínculo com ficha (os ingredientes da receita ficam em insumo_ficha)
 * e não tem mais a coluna "extra" (pedidos extras usam solicitacao_insumo).
 */
@Entity
@Table(name = "insumo")
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Long id;

    @Column(name = "quantidade", nullable = false)
    private int quantidade;

    @Column(name = "quantidade_minima")
    private Integer quantidadeMinima;

    @Column(name = "unidade_medida", length = 5)
    private String unidadeMedida;

    @Column(name = "cancelado", nullable = false, length = 1)
    private char cancelado = 'N';

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_produto")
    private Produto produto;

    // FK para a tabela unidade (ex.: SENAC Taguatinga). Se você tiver a entidade
    // Unidade, pode trocar por @ManyToOne com @JoinColumn(name = "id_unidade").
    @Column(name = "id_unidade")
    private Integer idUnidade;

    @Column(name = "data_validade")
    private LocalDate dataValidade;

    @Column(name = "lote", length = 50)
    private String lote;

    public Insumo() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public Integer getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(Integer quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }

    public char getCancelado() { return cancelado; }
    public void setCancelado(char cancelado) { this.cancelado = cancelado; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getIdUnidade() { return idUnidade; }
    public void setIdUnidade(Integer idUnidade) { this.idUnidade = idUnidade; }

    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }

    public String getLote() { return lote; }
    public void setLote(String lote) { this.lote = lote; }
}