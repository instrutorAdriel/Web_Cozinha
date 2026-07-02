package com.example.primeiroAppSpring.service;


import com.example.primeiroAppSpring.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessaoService {


    private static final String Chave_Session = "UsuarioLogado";

    public void salvarUsuarioLogado(HttpSession session, Usuario usuario){
        session.setAttribute(Chave_Session, usuario);
    }

    public Usuario buscarUsuarioLogado(HttpSession session){
        return (Usuario)session.getAttribute(Chave_Session);
    }

    public void encerrarSessao(HttpSession session){
        session.removeAttribute(Chave_Session);
        session.invalidate();
    }

}
