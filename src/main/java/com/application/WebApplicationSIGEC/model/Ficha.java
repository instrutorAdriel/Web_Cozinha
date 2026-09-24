package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "ficha")
public class Ficha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha")
    private Long id;

    @Column(name = "nome_ficha", nullable = false, length = 100)
    private String nomeFicha;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String preparo;

    @Column(nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma")
    private Turma turma;

    @Column(name = "data")
    private LocalDate data;

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Insumo> insumos;

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChecklistUtensilio> checklistUtensilios;

    public Ficha() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeFicha() { return nomeFicha; }
    public void setNomeFicha(String nomeFicha) { this.nomeFicha = nomeFicha; }
    public String getPreparo() { return preparo; }
    public void setPreparo(String preparo) { this.preparo = preparo; }
    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }
    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public List<Insumo> getInsumos() { return insumos; }
    public void setInsumos(List<Insumo> insumos) { this.insumos = insumos; }
    public List<ChecklistUtensilio> getChecklistUtensilios() { return checklistUtensilios; }
    public void setChecklistUtensilios(List<ChecklistUtensilio> checklistUtensilios) { this.checklistUtensilios = checklistUtensilios; }
}