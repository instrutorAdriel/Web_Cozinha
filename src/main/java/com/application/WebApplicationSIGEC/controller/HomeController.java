package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.repository.TurmaRepository;
import com.application.WebApplicationSIGEC.service.HomeService;
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
    private com.application.WebApplicationSIGEC.service.FichasService fichasService;

    @Autowired
    private com.application.WebApplicationSIGEC.repository.TurmaRepository turmaRepository;

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

    //  Lógica para Saudação Dinâmica
    java.time.LocalTime agora = java.time.LocalTime.now();
    String saudacao;
    if (agora.getHour() >= 0 && agora.getHour() < 12) {
        saudacao = "Bom dia";
    } else if (agora.getHour() >= 12 && agora.getHour() < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }
    model.addAttribute("saudacao", saudacao);

    return "home";
}


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        sessaoService.encerrarSessao(session);
        return "redirect:/login";
    }


    // Endpoint 1: Busca as aulas programadas para o dia DO USUÁRIO LOGADO
    @GetMapping("/api/agendamentos/hoje")
    @ResponseBody
    public ResponseEntity<List<Agendamento>> getAgendamentosDoDia(HttpSession session) {
        // Recupera o usuário da sessão
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized se não estiver logado
        }

        LocalDate dataBusca = LocalDate.now();
        // Passa a data E o ID do usuário para o service
        List<Agendamento> agendamentos = homeService.buscarAulasDoDia(dataBusca, usuarioLogado.getId());

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

    // Endpoint 3: Busca as fichas vinculadas às turmas DO USUÁRIO LOGADO
    @GetMapping("/api/fichas")
    @ResponseBody
    public ResponseEntity<List<com.application.WebApplicationSIGEC.model.Ficha>> getTodasFichas(HttpSession session) {
        // Recupera o usuário da sessão
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized se não estiver logado
        }

        // Usa o novo metodo do service passando o ID do usuário
        List<com.application.WebApplicationSIGEC.model.Ficha> fichasDoUsuario = fichasService.buscarFichasPorUsuario(usuarioLogado.getId());

        return ResponseEntity.ok(fichasDoUsuario);
    }

    // Endpoint 4: Busca apenas as turmas VINCULADAS AO USUÁRIO LOGADO
    @GetMapping("/api/turmas")
    @ResponseBody
    public ResponseEntity<List<com.application.WebApplicationSIGEC.model.Turma>> getTurmasDoUsuario(HttpSession session) {
        // 1. Recupera o usuário da sessão
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        // 2. Bloqueia se a sessão for nula ou inválida
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        // 3. Usa o repositório para buscar as turmas passando o ID do usuário
        List<com.application.WebApplicationSIGEC.model.Turma> turmasDoUsuario = turmaRepository.findTurmasByUsuarioId(usuarioLogado.getId());

        // 4. Retorna a lista em formato JSON
        return ResponseEntity.ok(turmasDoUsuario);
    }

    @PostMapping("/api/fichas/confirmar-separacao")
    @ResponseBody
    public ResponseEntity<String> confirmarSeparacaoInsumos(
            @RequestBody Map<String, Object> payload) {

        List<Integer> insumosInt = (List<Integer>) payload.get("insumosMarcados");
        List<Long> insumoIds = insumosInt.stream().map(Integer::longValue).toList();
        String observacao = (String) payload.get("observacao");

        homeService.confirmarSeparacaoInsumos(insumoIds, observacao);

        return ResponseEntity.ok("Estoque atualizado com sucesso!");
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
        // Agora recebe uma lista de IDs
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