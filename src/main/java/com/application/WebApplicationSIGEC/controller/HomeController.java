package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private HomeService homeService;

@GetMapping("/home")
public String exibirHome(Model model, HttpServletRequest request) {

    HttpSession session = request.getSession(false);


    if (session == null || session.getAttribute("usuarioLogado") == null) {
        return "redirect:/login"; // Redireciona e PARA a execução
    }

    Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");



    String primeiroNome = usuarioLogado.getNomeUsuario().split(" ")[0];
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


    // Endpoint 1: Busca as aulas programadas para o dia
    @GetMapping("/api/agendamentos/hoje")
    @ResponseBody // Indica que o retorno é JSON e não uma página HTML
    public ResponseEntity<List<Agendamento>> getAgendamentosDoDia() {


        LocalDate dataBusca = LocalDate.now();

        List<Agendamento> agendamentos = homeService.buscarAulasDoDia(dataBusca);

        if (agendamentos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(agendamentos);
    }

    // Endpoint 2: Busca os insumos e utensílios exatos da Ficha selecionada
    @GetMapping("/api/fichas/{fichaId}/detalhes")
    @ResponseBody // Indica que o retorno é JSON e não uma página HTML
    public ResponseEntity<Map<String, Object>> getDetalhesFicha(@PathVariable Long fichaId) {

        Map<String, Object> detalhes = homeService.buscarDetalhesDaReceita(fichaId);
        return ResponseEntity.ok(detalhes);
    }

}