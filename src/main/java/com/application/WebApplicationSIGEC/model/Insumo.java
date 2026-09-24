package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "insumo")
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Long id;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, length = 1)
    private String cancelado = "N";

    @Column(nullable = false, length = 1)
    private String extra = "N";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ficha")
    private Ficha ficha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_produto")
    private Produto produto;

    public Insumo() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public String getCancelado() { return cancelado; }
    public void setCancelado(String cancelado) { this.cancelado = cancelado; }
    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }
    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
}