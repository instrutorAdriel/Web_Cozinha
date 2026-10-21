package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.application.WebApplicationSIGEC.model.Agendamento;
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

    @Autowired
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

    @GetMapping("/turmas/usuario")
    @ResponseBody
    public ResponseEntity<List<Turma>> obterTurmasDoUsuario(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        List<Turma> turmas = turmaRepository.findTurmasByUsuarioId(usuarioLogado.getId());
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/calendario/fichas-alocadas")
    @ResponseBody
    public ResponseEntity<List<Agendamento>> obterFichasAlocadas(
            @RequestParam(value = "idTurma", required = false) Long idTurma,
            HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        List<Agendamento> alocadas = fichasService.buscarTodosAgendamentosDaTurma(usuarioLogado.getId(), idTurma);
        return ResponseEntity.ok(alocadas);
    }

    @GetMapping("/calendario/fichas")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> exibirFichaData(
            @RequestParam("data") String data,
            @RequestParam(value = "idTurma", required = false) Long idTurma,
            HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        LocalDate dataSelecionada = LocalDate.parse(data);

        Map<String, Object> response = fichasService.buscarFichasEDisponiveisDoDia(
                usuarioLogado.getId(), idTurma, dataSelecionada);

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
}