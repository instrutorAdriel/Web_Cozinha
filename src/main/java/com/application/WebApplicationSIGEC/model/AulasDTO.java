package com.application.WebApplicationSIGEC.model;

public class AulasDTO {

    private String status;         // CONCLUIDA, EM_ANDAMENTO, PENDENTE
    private String codigoReceita;  // Ex: confeitaria_bolo
    private String turma;          // Ex: 2024.1.C
    private String horarioInicio;  // Ex: 08:00
    private String horarioFim;     // Ex: 12:00
    private String nomeDisciplina; // Ex: Técnicas Básicas de Confeitaria
    private String salaCozinha;    // Ex: Cozinha Pedagógica 02

    // Construtor padrão
    public AulasDTO() {}

    // Construtor completo
    public AulasDTO(String status, String codigoReceita, String turma, String horarioInicio,
                   String horarioFim, String nomeDisciplina, String salaCozinha) {
        this.status = status;
        this.codigoReceita = codigoReceita;
        this.turma = turma;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.nomeDisciplina = nomeDisciplina;
        this.salaCozinha = salaCozinha;
    }

    // Getters e Setters (Se usar Lombok, pode trocar por @Data)
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCodigoReceita() { return codigoReceita; }
    public void setCodigoReceita(String codigoReceita) { this.codigoReceita = codigoReceita; }

    public String getTurma() { return turma; }
    public void setTurma(String turma) { this.turma = turma; }

    public String getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(String horarioInicio) { this.horarioInicio = horarioInicio; }

    public String getHorarioFim() { return horarioFim; }
    public void setHorarioFim(String horarioFim) { this.horarioFim = horarioFim; }

    public String getNomeDisciplina() { return nomeDisciplina; }
    public void setNomeDisciplina(String nomeDisciplina) { this.nomeDisciplina = nomeDisciplina; }

    public String getSalaCozinha() { return salaCozinha; }
    public void setSalaCozinha(String salaCozinha) { this.salaCozinha = salaCozinha; }
}