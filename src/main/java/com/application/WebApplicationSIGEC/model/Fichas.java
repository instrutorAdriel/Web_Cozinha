package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;



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
}
