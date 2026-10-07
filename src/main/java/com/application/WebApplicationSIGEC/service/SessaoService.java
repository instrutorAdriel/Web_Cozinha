package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Usuario;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

@Service
public class SessaoService {

    private static final String CHAVE_SESSAO = "usuarioLogado";

    public void salvarUsuarioLogado(HttpSession session, Usuario usuario) {
        session.setAttribute(CHAVE_SESSAO, usuario);
    }

    public Usuario buscarUsuarioLogado(HttpSession session) {
        return (Usuario) session.getAttribute(CHAVE_SESSAO);
    }

    public void encerrarSessao(HttpSession session) {
        if (session != null) {
            session.removeAttribute(CHAVE_SESSAO);
            session.invalidate();
        }
    }
}