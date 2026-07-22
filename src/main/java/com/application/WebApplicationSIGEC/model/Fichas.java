package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.List;


@Entity
@Table(name = "fichas")
public class Fichas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String preparo;

    @Column(name = "data")
    private LocalDate data;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "fichas_turmas",
            joinColumns = @JoinColumn(name = "ficha_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "turma_id", referencedColumnName = "id")
    )
    @JsonIgnoreProperties("fichas")
    private Set<Turmas> turmas = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "fichas_insumos",
            joinColumns = @JoinColumn(name= "ficha_id"),
            inverseJoinColumns = @JoinColumn(name = "insumos_id")
    )
    private List<Insumos> insumos;

    @ManyToMany
    @JoinTable(
            name = "fichas_utensilios",
            joinColumns = @JoinColumn(name = "ficha_id"),
            inverseJoinColumns = @JoinColumn(name = "utensilio_id")
    )
    private List<Utensilios> utensilios;

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

    public void setNome(String nome) {
        this.nome = nome;
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
    public List<Utensilios> getUtensilios() {
        return utensilios;
    }
    public void setUtensilios(List<Utensilios> utensilios) {
        this.utensilios = utensilios;
    }

    public Set<Turmas> getTurmas() {
        return turmas;
    }

    public void setTurmas(Set<Turmas> turmas) {
        this.turmas = turmas;
    }
}