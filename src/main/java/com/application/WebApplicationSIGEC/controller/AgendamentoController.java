package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.service.AgendamentoService;
import com.application.WebApplicationSIGEC.service.SessaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final SessaoService sessaoService;

    public AgendamentoController(AgendamentoService agendamentoService, SessaoService sessaoService) {
        this.agendamentoService = agendamentoService;
        this.sessaoService = sessaoService;
    }

    @GetMapping("/turmas")
    public ResponseEntity<?> listarTurmasInstrutor(HttpSession session) {
        Usuario usuario = sessaoService.buscarUsuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        // Chamada ajustada para utilizar o e-mail do usuário
        List<Turmas> turmas = agendamentoService.buscarTurmasPorUsuarioEmail(usuario.getEmail());
        return ResponseEntity.ok(turmas);
    }

    @GetMapping
    public ResponseEntity<?> listarAgendamentosPorTurmaEData(
            @RequestParam("turmaId") Integer turmaId,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            HttpSession session) {

        if (sessaoService.buscarUsuarioLogado(session) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Agendamento> agendamentos = agendamentoService.buscarAgendamentosPorTurmaEData(turmaId, data);
        return ResponseEntity.ok(agendamentos);
    }

    @PostMapping("/alocar")
    public ResponseEntity<?> alocarFicha(@RequestBody Map<String, Object> payload, HttpSession session) {
        if (sessaoService.buscarUsuarioLogado(session) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Integer fichaId = Integer.valueOf(payload.get("fichaId").toString());
            Integer turmaId = Integer.valueOf(payload.get("turmaId").toString());
            LocalDate data = LocalDate.parse(payload.get("data").toString());

            agendamentoService.alocarFichaNaTurma(fichaId, turmaId, data);
            return ResponseEntity.ok(Map.of("message", "Ficha agendada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/desalocar")
    public ResponseEntity<?> desalocarFicha(@RequestBody Map<String, Object> payload, HttpSession session) {
        if (sessaoService.buscarUsuarioLogado(session) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Integer fichaId = Integer.valueOf(payload.get("fichaId").toString());
            Integer turmaId = Integer.valueOf(payload.get("turmaId").toString());
            LocalDate data = LocalDate.parse(payload.get("data").toString());

            agendamentoService.desalocarFichaNaTurma(fichaId, turmaId, data);
            return ResponseEntity.ok(Map.of("message", "Agendamento removido com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}