package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_turmas")
public class UsuarioTurmas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_turma")
    private Integer idUsuarioTurma;

    @Column(name = "id_turma")
    private Integer idTurma;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    public Integer getIdUsuarioTurma() {
        return idUsuarioTurma;
    }

    public void setIdUsuarioTurma(Integer idUsuarioTurma) {
        this.idUsuarioTurma = idUsuarioTurma;
    }

    public Integer getIdTurma() {
        return idTurma;
    }

    public void setIdTurma(Integer idTurma) {
        this.idTurma = idTurma;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}