package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
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

    // Relação intermediária com quantidade por ficha

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FichaUtensilio> utensilios = new ArrayList<>();

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FichaInsumo> ingredientes = new ArrayList<>();

    public Fichas() {}

    public Fichas(String nome, LocalDate data, String preparo) {
        this.nome = nome;
        this.data = data;
        this.preparo = preparo;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getPreparo() { return preparo; }
    public void setPreparo(String preparo) { this.preparo = preparo; }

    public List<FichaInsumo> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<FichaInsumo> ingredientes) { this.ingredientes = ingredientes; }

    public List<FichaUtensilio> getUtensilios() { return utensilios; }
    public void setUtensilios(List<FichaUtensilio> utensilios) { this.utensilios = utensilios; }
}
