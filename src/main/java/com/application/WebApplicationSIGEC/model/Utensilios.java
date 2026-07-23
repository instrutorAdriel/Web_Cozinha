package com.application.WebApplicationSIGEC.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "utensilios")
public class Utensilios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false)
    private Integer quantidade;

    @ManyToMany(mappedBy = "utensilios")
    private List<Fichas> fichas;

    protected Utensilios() {
    }

    public Utensilios(String nome, Integer quantidade) {
        this.nome = nome;
        this.quantidade = quantidade;
    }
    public Long getId() {
        return id;
    }
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    public Integer getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public List<Fichas> getFichas() {
        return fichas;
    }
    public void setFichas(List<Fichas> fichas) {
        this.fichas = fichas;
    }

}