package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

import javax.annotation.processing.Generated;

@Entity
@Table(name = "solicitacao_insumo")
public class SolicitacaoInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao_insumo")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario")
    private Usuario id_usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turma")
    private Turma id_turma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_insumo")
    private Insumo id_insumo;

    private String data_solicitacao;

    private int quantidade;

    private String unidade_medida;

    private String justificativa;

    private String situacao;

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public String getUnidade_medida() {
        return unidade_medida;
    }

    public void setUnidade_medida(String unidade_medida) {
        this.unidade_medida = unidade_medida;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public String getData_solicitacao() {
        return data_solicitacao;
    }

    public void setData_solicitacao(String data_solicitacao) {
        this.data_solicitacao = data_solicitacao;
    }

    public Insumo getId_insumo() {
        return id_insumo;
    }

    public void setId_insumo(Insumo id_insumo) {
        this.id_insumo = id_insumo;
    }

    public Turma getId_turma() {
        return id_turma;
    }

    public void setId_turma(Turma id_turma) {
        this.id_turma = id_turma;
    }

    public Usuario getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Usuario id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
