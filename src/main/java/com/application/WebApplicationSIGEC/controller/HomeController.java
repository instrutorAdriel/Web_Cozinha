package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.SessaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private SessaoService sessaoService;

@GetMapping("/home")
public String exibirHome(Model model, HttpServletRequest request){

    HttpSession session = request.getSession(false);


    if (session == null || session.getAttribute("usuarioLogado") == null) {
        return "redirect:/login"; // Redireciona e PARA a execução
    }

   Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

   // model.addAttribute("nomeUsuario", usuarioLogado.getNome().split(" ")[0]);

    String primeiroNome = usuarioLogado.getNome().split(" ")[0];
    primeiroNome = primeiroNome.substring(0, 1).toUpperCase()
            + primeiroNome.substring(1).toLowerCase();

    model.addAttribute("nomeUsuario", primeiroNome);


    return "home";
}

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        sessaoService.encerrarSessao(session);
        return "redirect:/login";
    }


}