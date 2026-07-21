package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class HomeController {

    private final SessaoService sessaoService;

    // Injeção de dependência via Construtor
    public HomeController(SessaoService sessaoService) {
        this.sessaoService = sessaoService;
    }

    @GetMapping("/home")
    public String exibirHome(Model model, HttpSession session) {

        // Usa o SessaoService para validar o usuário logado
        Usuario usuarioLogado = sessaoService.buscarUsuarioLogado(session);

        if (usuarioLogado == null) {
            return "redirect:/login";
        }

        // Formatação do Primeiro Nome
        String primeiroNome = usuarioLogado.getNome().split(" ")[0];
        primeiroNome = primeiroNome.substring(0, 1).toUpperCase()
                + primeiroNome.substring(1).toLowerCase();

        model.addAttribute("nomeUsuario", primeiroNome);

        // Data Formatada
        LocalDate hoje = LocalDate.now();
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM", new Locale("pt", "BR"));
        String dataAtualFormatada = hoje.format(formatador).toUpperCase();

        model.addAttribute("dataDeHoje", dataAtualFormatada);

        return "home";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        sessaoService.encerrarSessao(session);
        return "redirect:/login";
    }
}