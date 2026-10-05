package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table
public class Unidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Long id;

    @Column(name = "nome_unidade", nullable = false, length = 100)
    private String nomeUnidade;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    public Unidade() {
    }

}