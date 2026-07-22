package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "fichas_insumos")

public class FichaInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "ficha_id")
    private Fichas ficha;

    @ManyToOne
    @JoinColumn(name = "insumos_id")
    private Insumos insumos;

    @Column(name = "quantidade", nullable = false)
    private Double quantidade;

    public FichaInsumo() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Fichas getFicha() {
        return ficha;
    }

    public void setFichas(Fichas ficha) {
        this.ficha = ficha;
    }

    public Insumos getInsumos() {
        return insumos;
    }

    public void setInsumos(Insumos insumos) {
        this.insumos = insumos;
    }

    public Double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Double quantidade) {
        this.quantidade = quantidade;
    }
}


