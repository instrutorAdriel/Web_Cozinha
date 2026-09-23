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
    private int quantidade;

    @Column(nullable = false, length = 1)
    private char cancelado = 'N';

    @ManyToOne
    @JoinColumn(name = "id_ficha")
    private Ficha ficha;

    @Column(name = "id_produto")
    private Long idProduto;

    public Insumo() {
    }

    public Insumo(int quantidade, char cancelado, Ficha ficha, Long idProduto) {
        this.quantidade = quantidade;
        this.cancelado = cancelado;
        this.ficha = ficha;
        this.idProduto = idProduto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public char getCancelado() {
        return cancelado;
    }

    public void setCancelado(char cancelado) {
        this.cancelado = cancelado;
    }

    public Ficha getFicha() {
        return ficha;
    }

    public void setFicha(Ficha ficha) {
        this.ficha = ficha;
    }

    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }
}