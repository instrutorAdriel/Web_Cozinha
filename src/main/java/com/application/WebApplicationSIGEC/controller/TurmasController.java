package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.service.TurmasService;
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

    @GetMapping("/calendario/turmas")
    @ResponseBody
    public ResponseEntity<List<Turmas>> obterTurmasDoProfessor() {
        // Exemplo: Fixando o ID do professor logado como 1 para testar.
        // No futuro, você pegará o ID do usuário logado na sessão ou no Spring Security.
        int idProfessorLogado = 1;

        List<com.application.WebApplicationSIGEC.model.Turmas> turmas = turmasService.listarTurmasPorUsuario(idProfessorLogado);
        return ResponseEntity.ok(turmas);
    }
}
