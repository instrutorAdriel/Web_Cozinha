package com.application.WebApplicationSIGEC.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agendamento")
    private Integer idAgendamento;

    private LocalDate data;
    private Character situacao;
    private Character concluido;

    // ALTERADO DE Integer PARA Long PARA COINCIDIR COM A ENTIDADE FICHA
    @Column(name = "id_ficha")
    private Long idFicha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ficha", insertable = false, updatable = false)
    private Ficha ficha;

    public Agendamento() {
    }

    public Integer getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Integer idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Character getSituacao() {
        return situacao;
    }

    public void setSituacao(Character situacao) {
        this.situacao = situacao;
    }

    public Character getConcluido() {
        return concluido;
    }

    public void setConcluido(Character concluido) {
        this.concluido = concluido;
    }

    // GETTER E SETTER ATUALIZADOS PARA Long
    public Long getIdFicha() {
        return idFicha;
    }

    public void setIdFicha(Long idFicha) {
        this.idFicha = idFicha;
    }

    public Ficha getFicha() {
        return ficha;
    }

    public void setFicha(Ficha ficha) {
        this.ficha = ficha;
        if (ficha != null) {
            this.idFicha = ficha.getIdFicha();
        }
    }
}