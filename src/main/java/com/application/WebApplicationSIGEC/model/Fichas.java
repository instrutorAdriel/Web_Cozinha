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
    private String receita;

    @Column(nullable = false, name = "data_cadastro")
    private LocalDate data;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String preparo;

    public Fichas() {
    }

    public Fichas(String receita, LocalDate data, String preparo) {
        this.receita = receita;
        this.data = data;
        this.preparo = preparo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getReceita() {
        return receita;
    }

    public void setReceita(String receita) {
        this.receita = receita;
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
