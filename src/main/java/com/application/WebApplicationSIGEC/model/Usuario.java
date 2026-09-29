package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nome_usuario", nullable = false, length = 100)
    private String nomeUsuario;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(name = "situacao", nullable = false) // ou name = "situação" se no seu banco tiver acento
    private char situacao;

    @Column(name = "acesso", nullable = false)
    private char acesso;

    @Column(name = "senha_temporaria")
    private boolean senhaTemporaria = true;

    public Usuario() {
    }

    // Adicione este construtor na sua classe Usuario.java
    public Usuario(String nomeUsuario, String email, String senha) {
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.senha = senha;
        this.acesso = 'P'; // Valor padrão do banco de dados
        this.situacao = 'A'; // Valor padrão do banco de dados
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public char getAcesso() {
        return acesso;
    }

    public void setAcesso(char acesso) {
        this.acesso = acesso;
    }

    public char getSituacao() {
        return situacao;
    }

    public void setSituacao(char situacao) {
        this.situacao = situacao;
    }

    public boolean isSenhaTemporaria() {
        return senhaTemporaria;
    }

    public void setSenhaTemporaria(boolean senhaTemporaria) {
        this.senhaTemporaria = senhaTemporaria;
    }
}