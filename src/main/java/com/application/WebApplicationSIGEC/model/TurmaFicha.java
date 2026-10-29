package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "turma_ficha")
public class TurmaFicha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma_ficha")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turma", nullable = false)
    private Turma turma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ficha", nullable = false)
    private Ficha ficha;

    @Column(name = "data")
    private LocalDate data;

    // Campo de situação essencial para controle de alocação/desalocação
    @Column(name = "situacao", length = 1)
    private String situacao = "A";

    public TurmaFicha() {}

    public TurmaFicha(Turma turma, Ficha ficha, LocalDate data) {
        this.turma = turma;
        this.ficha = ficha;
        this.data = data;
        this.situacao = "A"; // Padrão 'A' de Ativo
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }

    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}