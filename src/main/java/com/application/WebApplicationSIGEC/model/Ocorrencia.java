package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocorrencia")
public class Ocorrencia implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ocorrencia")
    private Integer id;

    @Column(length = 255)
    private String observacao;

    @Column(name = "data_hora", insertable = false, updatable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @Lob
    @Column(name = "imagem", columnDefinition = "LONGBLOB")
    private byte[] imagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utensilio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Utensilios utensilio;

    public Ocorrencia() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public byte[] getImagem() { return imagem; }
    public void setImagem(byte[] imagem) { this.imagem = imagem; }

    public Utensilios getUtensilio() { return utensilio; }
    public void setUtensilio(Utensilios utensilio) { this.utensilio = utensilio; }
}