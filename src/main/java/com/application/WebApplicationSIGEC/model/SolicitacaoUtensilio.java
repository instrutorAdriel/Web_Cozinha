package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitacao_utensilio")
public class SolicitacaoUtensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao_utensilio")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario")
    private Usuario id_usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turma")
    private Turma id_turma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_utensilio")
    private Utensilio id_utensilio;

    private String data_solicitacao;

    private int quantidade;

    private String justificativa;

    private String situacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Usuario id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Turma getId_turma() {
        return id_turma;
    }

    public void setId_turma(Turma id_turma) {
        this.id_turma = id_turma;
    }

    public Utensilio getId_utensilio() {
        return id_utensilio;
    }

    public void setId_utensilio(Utensilio id_utensilio) {
        this.id_utensilio = id_utensilio;
    }

    public String getData_solicitacao() {
        return data_solicitacao;
    }

    public void setData_solicitacao(String data_solicitacao) {
        this.data_solicitacao = data_solicitacao;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }
}