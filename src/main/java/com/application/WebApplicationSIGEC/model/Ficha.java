package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ficha")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ficha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha")
    private Long id;

    @Column(name = "nome_ficha", nullable = false, length = 100)
    private String nomeFicha;

    @Column(name = "preparo", columnDefinition = "TEXT")
    private String preparo;

    @Column(name = "categoria", length = 50)
    private String categoria;

    @Column(name = "situacao", nullable = false, length = 1)
    private String situacao = "A";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turma")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Turma turma;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "turma_ficha",
            joinColumns = @JoinColumn(name = "id_ficha"),
            inverseJoinColumns = @JoinColumn(name = "id_turma")
    )
    private List<Turma> turmas;

    @Column(name = "data")
    private LocalDate data;

    @JsonIgnore
    @OneToMany(mappedBy = "ficha", fetch = FetchType.LAZY)
    private List<InsumoFicha> insumos = new ArrayList<>();

    @JsonIgnore
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

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }

    public List<Turma> getTurmas() { return turmas; }
    public void setTurmas(List<Turma> turmas) { this.turmas = turmas; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public List<InsumoFicha> getInsumos() { return insumos; }
    public void setInsumos(List<InsumoFicha> insumos) { this.insumos = insumos; }

    public List<ChecklistUtensilio> getChecklistUtensilios() { return checklistUtensilios; }
    public void setChecklistUtensilios(List<ChecklistUtensilio> checklistUtensilios) { this.checklistUtensilios = checklistUtensilios; }
}
