package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agendamento")
    private Integer idAgendamento;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name =  "situacao", nullable = false, length = 1)
    private String situacao = "A";

    @Column(nullable = false, length = 1)
    private String concluido = "N";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ficha")
    private Ficha ficha;

    public Agendamento() {}

    // Getters e Setters

    public Integer getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Integer idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public String getConcluido() { return concluido; }
    public void setConcluido(String concluido) { this.concluido = concluido; }
    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }
}