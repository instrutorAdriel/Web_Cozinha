package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class SessaoService {

    // A chave DEVE ser exatamente igual em todas as chamadas
    public static final String CHAVE_SESSAO = "UsuarioLogado";

    public void salvarUsuarioLogado(HttpSession session, Usuario usuario) {
        session.setAttribute(CHAVE_SESSAO, usuario);
    }

    public Usuario buscarUsuarioLogado(HttpSession session) {
        if (session == null) return null;
        return (Usuario) session.getAttribute(CHAVE_SESSAO);
    }

    public void encerrarSessao(HttpSession session) {
        if (session != null) {
            session.removeAttribute(CHAVE_SESSAO);
            session.invalidate();
        }
    }
}