package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.repository.TurmaRepository;
import com.application.WebApplicationSIGEC.service.HomeService;
import com.application.WebApplicationSIGEC.service.FichasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private HomeService homeService;

    @Autowired
    private FichasService fichasService;

    @Autowired
    private TurmaRepository turmaRepository;

    @GetMapping("/home")
    public String exibirHome(Model model, HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        // Tratamento seguro do primeiro nome
        String primeiroNome = "Instrutor";
        if (usuarioLogado != null && usuarioLogado.getNomeUsuario() != null && !usuarioLogado.getNomeUsuario().trim().isEmpty()) {
            String nomeLimpo = usuarioLogado.getNomeUsuario().trim();
            String parteInicial = nomeLimpo.split("\\s+")[0];
            if (!parteInicial.isEmpty()) {
                primeiroNome = parteInicial.substring(0, 1).toUpperCase() + parteInicial.substring(1).toLowerCase();
            }
        }
        model.addAttribute("nomeUsuario", primeiroNome);

        // Data formatada e vinculada ao modelo
        try {
            LocalDate hoje = LocalDate.now();
            DateTimeFormatter formatador = DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM", new Locale("pt", "BR"));
            String dataAtualFormatada = hoje.format(formatador);
            dataAtualFormatada = dataAtualFormatada.substring(0, 1).toUpperCase() + dataAtualFormatada.substring(1);
            model.addAttribute("dataDeHoje", dataAtualFormatada);
        } catch (Exception e) {
            model.addAttribute("dataDeHoje", "");
        }

        // Saudação Dinâmica
        java.time.LocalTime agora = java.time.LocalTime.now();
        String saudacao = "Bom dia";
        if (agora.getHour() >= 12 && agora.getHour() < 18) {
            saudacao = "Boa tarde";
        } else if (agora.getHour() >= 18 || agora.getHour() < 5) {
            saudacao = "Boa noite";
        }
        model.addAttribute("saudacao", saudacao);

        return "home";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        sessaoService.encerrarSessao(session);
        return "redirect:/";
    }

    @GetMapping("/api/agendamentos/hoje")
    @ResponseBody
    public ResponseEntity<List<Agendamento>> getAgendamentosDoDia(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        LocalDate dataBusca = LocalDate.now();
        List<Agendamento> agendamentos = homeService.buscarAulasDoDia(dataBusca, usuarioLogado.getId());

        if (agendamentos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/api/fichas/{fichaId}/detalhes")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDetalhesFicha(@PathVariable Long fichaId) {
        Map<String, Object> detalhes = homeService.buscarDetalhesDaReceita(fichaId);
        return ResponseEntity.ok(detalhes);
    }

    @GetMapping("/api/fichas")
    @ResponseBody
    public ResponseEntity<List<com.application.WebApplicationSIGEC.model.Ficha>> getTodasFichas(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        List<com.application.WebApplicationSIGEC.model.Ficha> fichasDoUsuario = fichasService.buscarFichasPorUsuario(usuarioLogado.getId());
        return ResponseEntity.ok(fichasDoUsuario);
    }

    @GetMapping("/api/turmas")
    @ResponseBody
    public ResponseEntity<List<com.application.WebApplicationSIGEC.model.Turma>> getTurmasDoUsuario(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        List<com.application.WebApplicationSIGEC.model.Turma> turmasDoUsuario = turmaRepository.findTurmasByUsuarioId(usuarioLogado.getId());
        return ResponseEntity.ok(turmasDoUsuario);
    }

    @PostMapping("/api/fichas/confirmar-separacao")
    @ResponseBody
    public ResponseEntity<String> confirmarSeparacaoInsumos(@RequestBody Map<String, Object> payload) {
        List<Integer> insumosInt = (List<Integer>) payload.get("insumosMarcados");
        List<Long> insumoIds = insumosInt.stream().map(Integer::longValue).toList();
        String observacao = (String) payload.get("observacao");

        try {
            homeService.confirmarSeparacaoInsumos(insumoIds, observacao);
            return ResponseEntity.ok("Estoque atualizado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/api/fichas/confirmar-utensilios")
    @ResponseBody
    public ResponseEntity<String> confirmarSaidaUtensilios(@RequestBody Map<String, Object> payload) {
        List<Integer> idsInt = (List<Integer>) payload.get("checklistIds");
        if (idsInt == null || idsInt.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum utensílio selecionado.");
        }
        List<Long> checklistIds = idsInt.stream().map(Integer::longValue).toList();

        try {
            homeService.confirmarSaidaUtensilios(checklistIds);
            return ResponseEntity.ok("Saída de utensílios registrada com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/api/fichas/devolver-utensilio")
    @ResponseBody
    public ResponseEntity<String> registrarDevolucaoUtensilio(@RequestBody Map<String, Object> payload) {
        List<Integer> idsInt = (List<Integer>) payload.get("checklistIds");
        if (idsInt == null || idsInt.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum utensílio selecionado para devolução.");
        }
        List<Long> checklistIds = idsInt.stream().map(Integer::longValue).toList();

        String estadoAtual = (String) payload.get("estadoAtual");
        String observacao = (String) payload.get("observacao");

        homeService.registrarDevolucaoUtensilio(checklistIds, estadoAtual, observacao);

        return ResponseEntity.ok("Devolução registrada com sucesso!");
    }

    public TurmaRepository getTurmaRepository() {
        return turmaRepository;
    }

    public void setTurmaRepository(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }
}