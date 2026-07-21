package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Turmas turma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ficha_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Fichas ficha;

    @Column(nullable = false)
    private LocalDate data;

    public Agendamento() {}

    public Agendamento(Turmas turma, Fichas ficha, LocalDate data) {
        this.turma = turma;
        this.ficha = ficha;
        this.data = data;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Turmas getTurma() { return turma; }
    public void setTurma(Turmas turma) { this.turma = turma; }

    public Fichas getFicha() { return ficha; }
    public void setFicha(Fichas ficha) { this.ficha = ficha; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
}