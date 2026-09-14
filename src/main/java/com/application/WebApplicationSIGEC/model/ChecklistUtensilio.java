package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "checklist_utensilho")
public class ChecklistUtensilio implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum EstadoUtensilio {
        PRONTO, EM_MANUTENCAO, DANIFICADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_checklist_utensilho")
    private Integer id;

    @Column(name = "data_hora_entrada")
    private LocalDateTime dataHoraEntrada;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private EstadoUtensilio estadoAnterior = EstadoUtensilio.PRONTO;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_atual")
    private EstadoUtensilio estadoAtual = EstadoUtensilio.PRONTO;

    @Column(length = 255)
    private String observacao;

    @Column(name = "data_hora_saida")
    private LocalDateTime dataHoraSaida;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ficha")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Fichas ficha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utensilio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Utensilios utensilio;

    public ChecklistUtensilio() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDataHoraEntrada() { return dataHoraEntrada; }
    public void setDataHoraEntrada(LocalDateTime dataHoraEntrada) { this.dataHoraEntrada = dataHoraEntrada; }

    public EstadoUtensilio getEstadoAnterior() { return estadoAnterior; }
    public void setEstadoAnterior(EstadoUtensilio estadoAnterior) { this.estadoAnterior = estadoAnterior; }

    public EstadoUtensilio getEstadoAtual() { return estadoAtual; }
    public void setEstadoAtual(EstadoUtensilio estadoAtual) { this.estadoAtual = estadoAtual; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public LocalDateTime getDataHoraSaida() { return dataHoraSaida; }
    public void setDataHoraSaida(LocalDateTime dataHoraSaida) { this.dataHoraSaida = dataHoraSaida; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Fichas getFicha() { return ficha; }
    public void setFicha(Fichas ficha) { this.ficha = ficha; }

    public Utensilios getUtensilio() { return utensilio; }
    public void setUtensilio(Utensilios utensilio) { this.utensilio = utensilio; }
}