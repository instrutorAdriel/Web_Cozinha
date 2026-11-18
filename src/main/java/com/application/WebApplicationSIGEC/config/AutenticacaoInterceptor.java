package com.application.WebApplicationSIGEC.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AutenticacaoInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        boolean logado = (session != null && session.getAttribute("usuarioLogado") != null);

        if (logado) {
            return true;
        }

        String uri = request.getRequestURI();
        boolean ehApi = uri.startsWith("/api/")
                || uri.startsWith("/calendario/")
                || uri.equals("/turmas/usuario");

        if (ehApi) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        } else {
            response.sendRedirect("/"); // Redireciona telas (/home, /calendario, /receitas)
        }

        return false;
    }
}