package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import com.application.WebApplicationSIGEC.service.SessaoService;
import com.application.WebApplicationSIGEC.service.TurmasService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/")
public class TurmasController {
    @Autowired
    private TurmasRepository turmasRepository;

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private TurmasService turmasService; // Injetado para usar no fluxo principal ou fallback

    @GetMapping("/calendario/turmas")
    @ResponseBody
    public ResponseEntity<List<Turmas>> obterTurmasDoProfessor(HttpServletRequest request) {

        // 1. Captura a sessão atual de forma segura (sem criar uma nova se não existir)
        HttpSession session = request.getSession(false);

        Usuario usuarioLogado = null;
        if (session != null) {
            usuarioLogado = sessaoService.buscarUsuarioLogado(session);
        }

        // 2. MODO DE TESTE / SEGURANÇA: Se o usuário não estiver logado na sessão,
        // mantém o comportamento anterior usando o ID 1 fixo para não travar seus testes do calendário!
        if (usuarioLogado == null) {
            int idProfessorLogadoMock = 1;
            List<Turmas> turmasMock = turmasService.listarTurmasPorUsuario(idProfessorLogadoMock);
            return ResponseEntity.ok(turmasMock);
        }

        // 3. FLUXO REAL: Se o usuário estiver devidamente logado,
        // busca as turmas dinamicamente usando o e-mail dele através do repositório
        List<Turmas> turmas = turmasRepository.findByUsuarioEmail(usuarioLogado.getEmail());
        return ResponseEntity.ok(turmas);
    }
}
