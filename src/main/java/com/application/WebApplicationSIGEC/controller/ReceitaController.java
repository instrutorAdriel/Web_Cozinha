package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.service.SessaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // 1. O Spring precisa desta anotação para saber que é um controller de páginas
public class ReceitaController {

    @Autowired
    private SessaoService sessaoService;

    @GetMapping("/receitas") // 2. Mapeia a URL /receitas
    public String receitas(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/"; // Redireciona e PARA a execução
        }

        return "telaReceitas"; // 3. Procura por receitas.html na pasta templates

    }
} // O fechamento de chave que estava sobrando no seu exemplo