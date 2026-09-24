package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "checklist_utensilho")
public class ChecklistUtensilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_checklist_utensilho")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ficha")
    private Ficha ficha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_utensilio")
    private Utensilio utensilio;

    @Column(name = "data_hora_entrada")
    private LocalDateTime dataHoraEntrada;

    @Column(name = "estado_anterior")
    private String estadoAnterior = "PRONTO";

    @Column(name = "estado_atual")
    private String estadoAtual = "PRONTO";

    @Column(length = 255)
    private String observacao;

    @Column(name = "data_hora_saida")
    private LocalDateTime dataHoraSaida;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    public ChecklistUtensilio() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Ficha getFicha() { return ficha; }
    public void setFicha(Ficha ficha) { this.ficha = ficha; }
    public Utensilio getUtensilio() { return utensilio; }
    public void setUtensilio(Utensilio utensilio) { this.utensilio = utensilio; }
    public LocalDateTime getDataHoraEntrada() { return dataHoraEntrada; }
    public void setDataHoraEntrada(LocalDateTime dataHoraEntrada) { this.dataHoraEntrada = dataHoraEntrada; }
    public String getEstadoAnterior() { return estadoAnterior; }
    public void setEstadoAnterior(String estadoAnterior) { this.estadoAnterior = estadoAnterior; }
    public String getEstadoAtual() { return estadoAtual; }
    public void setEstadoAtual(String estadoAtual) { this.estadoAtual = estadoAtual; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public LocalDateTime getDataHoraSaida() { return dataHoraSaida; }
    public void setDataHoraSaida(LocalDateTime dataHoraSaida) { this.dataHoraSaida = dataHoraSaida; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
}