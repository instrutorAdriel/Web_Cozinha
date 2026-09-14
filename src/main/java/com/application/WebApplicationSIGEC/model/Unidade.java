package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "unidade")
public class Unidade implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Integer id;

    @Column(name = "nome_unidade", nullable = false, length = 100)
    private String nomeUnidade;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    public Unidade() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeUnidade() { return nomeUnidade; }
    public void setNomeUnidade(String nomeUnidade) { this.nomeUnidade = nomeUnidade; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}