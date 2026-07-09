package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "fichas")
public class Fichas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "data")
    private LocalDate data;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String preparo;

    @ManyToMany
    @JoinTable(
            name = "fichas_insumos",
            joinColumns = @JoinColumn(name= "ficha_id"),
            inverseJoinColumns = @JoinColumn(name = "insumos_id")
    )
    private List<Insumos> insumos;

    public Fichas() {
    }

    public Fichas(String nome, LocalDate data, String preparo) {
        this.nome = nome;
        this.data = data;
        this.preparo = preparo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String receita) {
        this.nome = receita;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getPreparo() {
        return preparo;
    }

    public void setPreparo(String preparo) {
        this.preparo = preparo;
    }

    public List<Insumos> getInsumos() {
        return insumos;
    }

    public void setInsumos(List<Insumos> insumos) {
        this.insumos = insumos;
    }
}
