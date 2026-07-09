package com.application.WebApplicationSIGEC.controller;

<<<<<<< HEAD
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.AulaService;
import com.application.WebApplicationSIGEC.model.AulasDTO;
import com.application.WebApplicationSIGEC.service.SessaoService;
import com.application.WebApplicationSIGEC.service.AulaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
=======
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

>>>>>>> b672467f3806d1c366e2a067e33735a8b0135b67
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
=======

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
>>>>>>> b672467f3806d1c366e2a067e33735a8b0135b67

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private SessaoService sessaoService;

@GetMapping("/home")
public String exibirHome(Model model, HttpServletRequest request) {

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


    //Data
    LocalDate hoje = LocalDate.now();
    DateTimeFormatter formatador = DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM", new Locale("pt", "BR"));
    String dataAtualFormatada = hoje.format(formatador).toUpperCase();

    // Envia para o HTML com o nome "dataDeHoje"
    model.addAttribute("dataDeHoje", dataAtualFormatada);
    return "home";
    }


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        sessaoService.encerrarSessao(session);
        return "redirect:/login";
    }
    @Autowired
    protected AulaService aulaService;
    @GetMapping("/cronograma")
    public String exibirCronograma(@RequestParam("data") LocalDate data, Model model) {
        // 1. Filtra as aulas do dia solicitado
        // Note a letra minúscula aqui
        List<AulasDTO> aulasDoDia = aulaService.buscarAulasPorData(data);

        // 2. Envia os dados para o Thymeleaf mapear
        model.addAttribute("aulas", aulasDoDia);
        model.addAttribute("diaFormatado", data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        model.addAttribute("dataFiltro", data.toString());

        // Retorna APENAS o bloco HTML que tiver o fragmento "bloco-aulas"
        return "home :: bloco-aulas";
    }

}