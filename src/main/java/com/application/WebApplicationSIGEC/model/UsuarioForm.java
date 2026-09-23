package com.application.WebApplicationSIGEC.model;

public class UsuarioForm {

    private String nomeUsuario;
    private String email;
    private String senha;
    private String confirmarSenha;

    // Novos campos para a tela de cadastro
    private String situacao;
    private String acesso;

    // Getters e Setters para todos os campos (inclusive os novos)
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getConfirmarSenha() { return confirmarSenha; }
    public void setConfirmarSenha(String confirmarSenha) { this.confirmarSenha = confirmarSenha; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public String getAcesso() { return acesso; }
    public void setAcesso(String acesso) { this.acesso = acesso; }
}