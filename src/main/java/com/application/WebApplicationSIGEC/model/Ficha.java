package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "ficha")
public class Ficha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha")
    private Long id;

    @Column(name = "nome_ficha", nullable = false, length = 100)
    private String nomeFicha;

    @Column(name = "data")
    private LocalDate data; // <-- Campo adicionado para suportar a alocação no calendário

    @Lob
    @Column(columnDefinition = "TEXT")
    private String preparo;

    @Column(name = "situacao", nullable = false, length = 1)
    private char situacao = 'A';

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<Insumo> insumos;

    public Ficha() {
    }

    public Ficha(String nomeFicha, LocalDate data, String preparo) {
        this.nomeFicha = nomeFicha;
        this.data = data;
        this.preparo = preparo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeFicha() {
        return nomeFicha;
    }

    public void setNomeFicha(String nomeFicha) {
        this.nomeFicha = nomeFicha;
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

    public char getSituacao() {
        return situacao;
    }

    public void setSituacao(char situacao) {
        this.situacao = situacao;
    }

    public List<Insumo> getInsumos() {
        return insumos;
    }

    public void setInsumos(List<Insumo> insumos) {
        this.insumos = insumos;
    }
}