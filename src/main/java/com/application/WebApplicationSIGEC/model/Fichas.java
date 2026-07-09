package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "fichas")
public class Fichas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String preparo;

    @Column(name = "data")
    private LocalDate data;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "fichas_turmas", // Tabela dedicada unicamente para Fichas e Turmas
            joinColumns = @JoinColumn(name = "ficha_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "turma_id", referencedColumnName = "id")
    )
    @JsonIgnoreProperties("fichas")
    private List<Turmas> turmas;
    public Fichas() {
    }

    public Fichas(String nome, LocalDate data, String preparo) {
        this.nome = nome;
        this.data = data;
        this.preparo = preparo;
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

    public List<Turmas> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Turmas> turmas) {
        this.turmas = turmas;
    }
}
