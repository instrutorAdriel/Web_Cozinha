package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;



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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turmas")
    @JsonIgnoreProperties({"fichas", "usuarios"}) // IMPEDE O LOOP: Ignora o carregamento reverso ao gerar o JSON
    private Turmas turmas;

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

    public Turmas getTurma() {
        return turmas;
    }

    public void setTurma(Turmas turmas) {
        this.turmas = turmas;
    }
}
