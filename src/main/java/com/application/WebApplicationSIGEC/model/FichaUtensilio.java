package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ficha_utensilio")
public class FichaUtensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ficha_id")
    @JsonIgnore // evita loop infinito na serialização
    private Fichas ficha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utensilio_id")
    private Utensilios utensilio;

    private Integer quantidade;

    public FichaUtensilio() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Fichas getFicha() { return ficha; }
    public void setFicha(Fichas ficha) { this.ficha = ficha; }

    public Utensilios getUtensilio() { return utensilio; }
    public void setUtensilio(Utensilios utensilio) { this.utensilio = utensilio; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}
