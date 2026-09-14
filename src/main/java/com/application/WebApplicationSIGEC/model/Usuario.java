package com.application.WebApplicationSIGEC.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;

    @Column(name = "nome_usuario", nullable = false, length = 100)
    private String nomeUsuario;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(nullable = false, length = 1)
    private String acesso = "P";

    @Column(name = "situacao", nullable = false, length = 1)
    private String situacao = "A";

    @Column(name = "senha_temporaria")
    private Boolean senhaTemporaria = true;

    @ManyToMany(mappedBy = "usuarios", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("usuarios")
    private List<Turmas> turmas;

    public Usuario() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getAcesso() { return acesso; }
    public void setAcesso(String acesso) { this.acesso = acesso; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public Boolean getSenhaTemporaria() { return senhaTemporaria; }
    public void setSenhaTemporaria(Boolean senhaTemporaria) { this.senhaTemporaria = senhaTemporaria; }

    public List<Turmas> getTurmas() { return turmas; }
    public void setTurmas(List<Turmas> turmas) { this.turmas = turmas; }
}