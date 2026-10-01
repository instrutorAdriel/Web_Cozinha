package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.model.Turma;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.repository.TurmaRepository;
import com.application.WebApplicationSIGEC.service.FichasService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class FichasController {

    private final FichasService fichasService;
    private final TurmaRepository turmaRepository;

    public FichasController(FichasService fichasService, TurmaRepository turmaRepository) {
        this.fichasService = fichasService;
        this.turmaRepository = turmaRepository;
    }

    @GetMapping("/calendario")
    public String exibirCalendario(HttpSession session) {
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }
        return "calendario";
    }

    // =========================================================
    // ENDPOINT ADICIONADO: Necessário para desenhar as bolinhas na grid
    // =========================================================
    @GetMapping("/calendario/fichas-alocadas")
    public ResponseEntity<List<Agendamento>> obterFichasAlocadas(
            @RequestParam(value = "idTurma", required = false) Integer idTurma,
            HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        // Você precisará de um método no serviço que retorne todos os agendamentos da turma para o mês
        List<Agendamento> alocadas = fichasService.buscarTodosAgendamentosDaTurma(usuarioLogado.getId(), idTurma);
        return ResponseEntity.ok(alocadas);
    }

    @GetMapping("/calendario/fichas")
    public ResponseEntity<Map<String, Object>> exibirFichaData(
            @RequestParam("data") String data,
            @RequestParam(value = "idTurma", required = false) Integer idTurma,
            HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        LocalDate dataSelecionada = LocalDate.parse(data);

        // 1. Fichas alocadas na data selecionada para a turma do usuário
        List<Agendamento> alocadas = fichasService.buscarAgendamentosDoDia(
                usuarioLogado.getId(), idTurma, dataSelecionada);

        // 2. Fichas disponíveis no acervo daquela turma
        List<Ficha> disponiveis = (idTurma != null)
                ? fichasService.buscarFichasPorTurma(idTurma)
                : List.of();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadas);
        response.put("disponiveis", disponiveis);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha(
            @RequestParam("id") Long id,
            @RequestParam("data") String dataFinal,
            HttpSession session) {

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(401).body("Acesso negado.");
        }

        LocalDate novaData = LocalDate.parse(dataFinal);
        fichasService.alocarFicha(id, novaData);

        return ResponseEntity.ok("Ficha agendada com sucesso!");
    }

    @PostMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha(
            @RequestParam("id") Long id,
            HttpSession session) {

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(401).body("Acesso negado.");
        }

        fichasService.desalocarFicha(id);

        return ResponseEntity.ok("Ficha removida do agendamento!");
    }

    // =========================================================
    // ENDPOINT DE TURMAS DO USUÁRIO LOGADO
    // =========================================================

    @GetMapping("/turmas/usuario")
    @ResponseBody
    public ResponseEntity<List<Turma>> obterTurmasDoUsuario(HttpSession session) {
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(401).build();
        }

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        // Busca as turmas diretamente pelo repository
        List<Turma> turmas = turmaRepository.buscarTurmasPorUsuario(usuarioLogado.getId());

        return ResponseEntity.ok(turmas);
    }
}