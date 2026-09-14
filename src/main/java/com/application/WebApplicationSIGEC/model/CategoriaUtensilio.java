package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "categoria_utensilio")
public class CategoriaUtensilio implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria_utensilio")
    private Integer id;

    @Column(name = "nome_categoria", nullable = false, length = 55)
    private String nomeCategoria;

    @Column(name = "situacao", nullable = false, length = 1)
    private String situacao = "A";

    public CategoriaUtensilio() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeCategoria() { return nomeCategoria; }
    public void setNomeCategoria(String nomeCategoria) { this.nomeCategoria = nomeCategoria; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}