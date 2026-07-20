package com.application.WebApplicationSIGEC.model;
import jakarta.persistence.*;

@Entity
@Table(name = "Insumos")
public class Insumos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false, length = 50)
    private String tipo;

    protected Insumos() {
    }

    public Insumos(String nome,String tipo, int quantidade,String unidade, String observação) {
        this.nome = nome;
        this.tipo = tipo;

    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

}