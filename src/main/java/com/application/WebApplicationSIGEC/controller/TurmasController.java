package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import com.application.WebApplicationSIGEC.service.TurmasService;
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
    private TurmasService turmasService;

    @Autowired
    private TurmasRepository turmasRepository;

    @GetMapping("/conectado")
    public List<Turmas> listarTurmasDoProfessorConectado(HttpSession session) {
        // Procura o e-mail ou objeto que guardou na sessão durante o login
        String emailUsuarioLogado = (String) session.getAttribute("usuarioEmail");

        if (emailUsuarioLogado == null) {
            // Se não houver ninguém na sessão, lança um erro ou retorna uma lista vazia
            throw new RuntimeException("Nenhum utilizador conectado.");
        }

        return turmasRepository.findByUsuarioEmail(emailUsuarioLogado);
    }

    @GetMapping("/calendario/exibirturmas")
    @ResponseBody
    public ResponseEntity<List<Turmas>> obterTurmasDoProfessor() {
        // Exemplo: Fixando o ID do professor logado como 1 para testar.
        // No futuro, você pegará o ID do usuário logado na sessão ou no Spring Security.
        int idProfessorLogado = 1;

        List<com.application.WebApplicationSIGEC.model.Turmas> turmas = turmasService.listarTurmasPorUsuario(idProfessorLogado);
        return ResponseEntity.ok(turmas);
    }
}
