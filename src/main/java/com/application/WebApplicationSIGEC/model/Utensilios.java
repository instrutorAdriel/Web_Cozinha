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
    @JsonIgnore
    @ManyToMany(mappedBy = "utensilios")
    private List<Fichas> fichas;

    protected Utensilios() {
    }

    public Utensilios(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Fichas> getFichas() {
        return fichas;
    }
    public void setFichas(List<Fichas> fichas) {
        this.fichas = fichas;
    }

}