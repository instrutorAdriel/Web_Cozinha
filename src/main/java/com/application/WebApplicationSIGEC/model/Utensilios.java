package com.application.WebApplicationSIGEC.model;
import jakarta.persistence.*;

@Entity
@Table(name = "utensilios")
public class Utensilios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;

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

}