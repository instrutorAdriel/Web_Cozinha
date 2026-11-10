package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "usuario_turma", uniqueConstraints = {
        @UniqueConstraint(name = "uk_usuario_turma", columnNames = {"id_usuario", "id_turma"})
})
public class UsuarioTurma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_turma")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_turma", nullable = false)
    private Turma turma;

    public UsuarioTurma() {}

    public UsuarioTurma(Usuario usuario, Turma turma) {
        this.usuario = usuario;
        this.turma = turma;
    }

    public UsuarioTurma(Long id, Usuario usuario, Turma turma) {
        this.id = id;
        this.usuario = usuario;
        this.turma = turma;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}