package com.application.WebApplicationSIGEC.model;
import jakarta.persistence.*;

import java.util.List;

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
    @Column(nullable = false, length = 100)
    private String unidade_medida;


    @ManyToMany(mappedBy = "insumos")
    private List<Fichas> fichas;

    protected Insumos() {
    }

    public Insumos(String nome,String tipo, int quantidade,String unidade_medida, String observação) {
        this.nome = nome;
        this.tipo = tipo;
        this.unidade_medida = unidade_medida;

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
    public String getUnidade_medida() {
        return unidade_medida;
    }
    public void setUnidade_medida(String unidade_medida) {
        this.unidade_medida = unidade_medida;
    }

}