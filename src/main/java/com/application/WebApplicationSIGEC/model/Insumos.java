package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "insumo")
public class Insumos implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Integer id;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, length = 1)
    private String cancelado = "N";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produto")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ficha")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "insumos"})
    private Fichas ficha;

    public Insumos() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getCancelado() { return cancelado; }
    public void setCancelado(String cancelado) { this.cancelado = cancelado; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Fichas getFicha() { return ficha; }
    public void setFicha(Fichas ficha) { this.ficha = ficha; }
}