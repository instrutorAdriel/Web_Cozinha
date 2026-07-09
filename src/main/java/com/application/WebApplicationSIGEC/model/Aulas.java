package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "aulas")
public class Aulas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "horario_inicio", nullable = false)
    private LocalTime horarioInicio;

    @Column(name = "horario_fim", nullable = false)
    private LocalTime horarioFim;

    @Column(nullable = false)
    private String turma;

    // Virou String pura! Você salvará "PENDENTE", "EM_ANDAMENTO" ou "CONCLUIDA"
    @Column(nullable = false)
    private String status;

    // Virou String pura! O nome da disciplina fica direto aqui
    @Column(name = "nome_disciplina", nullable = false)
    private String nomeDisciplina;

    @Column(name = "laboratorio_ou_sala")
    private String laboratorioOuSala;

    // Mantemos apenas o relacionamento com as Fichas (que é obrigatório para sua regra de negócio)
    @ManyToOne
    @JoinColumn(name = "ficha_id", nullable = false)
    private Fichas ficha;

    // Construtor Padrão
    public Aulas() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }

    public String getTurma() { return turma; }
    public void setTurma(String turma) { this.turma = turma; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNomeDisciplina() { return nomeDisciplina; }
    public void setNomeDisciplina(String nomeDisciplina) { this.nomeDisciplina = nomeDisciplina; }

    public String getLaboratorioOuSala() { return laboratorioOuSala; }
    public void setLaboratorioOuSala(String laboratorioOuSala) { this.laboratorioOuSala = laboratorioOuSala; }

    public Fichas getFicha() { return ficha; }
    public void setFicha(Fichas ficha) { this.ficha = ficha; }
}