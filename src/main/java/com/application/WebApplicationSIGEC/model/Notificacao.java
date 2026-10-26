package com.application.WebApplicationSIGEC.model;

public class Notificacao {
    private Long id;
    private String tipo;          // "Insumo" ou "Utensílio"
    private String detalhe;       // Ex: "Farinha de Trigo - 2 KG (Turma 2026.1)"
    private String status;        // "pendente", "aprovado", "negado"
    private String statusTexto;   // "Pendente", "Aprovado", "Negado"
    private String dataSolicitacao;

    public Notificacao(Long id, String tipo, String detalhe, String situacaoRaw, String dataSolicitacao) {
        this.id = id;
        this.tipo = tipo;
        this.detalhe = detalhe;
        this.dataSolicitacao = dataSolicitacao;

        if (situacaoRaw == null) {
            this.status = "pendente";
            this.statusTexto = "Pendente";
            return;
        }

        String st = situacaoRaw.trim().toUpperCase();

        if ("A".equals(st) || "APROVADO".equals(st)) {
            this.status = "aprovado";
            this.statusTexto = "Aprovado";
        } else if ("R".equals(st) || "N".equals(st) || "RECUSADO".equals(st) || "NEGADO".equals(st) || "C".equals(st)) {
            this.status = "negado";
            this.statusTexto = "Negado";
        } else {
            this.status = "pendente";
            this.statusTexto = "Pendente";
        }
    }

    public Long getId() { return id; }
    public String getTipo() { return tipo; }
    public String getDetalhe() { return detalhe; }
    public String getStatus() { return status; }
    public String getStatusTexto() { return statusTexto; }
    public String getDataSolicitacao() { return dataSolicitacao; }
}