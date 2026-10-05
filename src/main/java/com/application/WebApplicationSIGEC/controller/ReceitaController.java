package com.application.WebApplicationSIGEC.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.service.FichasService;
import com.application.WebApplicationSIGEC.service.SessaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class ReceitaController {

    private final FichasService fichasService;
    private final SessaoService sessaoService;

    // Injeção via construtor (prática recomendada na skill java-pro)
    public ReceitaController(FichasService fichasService, SessaoService sessaoService) {
        this.fichasService = fichasService;
        this.sessaoService = sessaoService;
    }

    @GetMapping("/receitas")
    public String receitas(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        return "telaReceitas";
    }

    /**
     * Endpoint REST para listar todas as fichas/receitas do banco de dados.
     */
    @GetMapping("/api/receitas")
    @ResponseBody
    public ResponseEntity<List<Ficha>> listarReceitas(HttpSession session) {
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Ficha> fichas = fichasService.buscarTodas();
        return ResponseEntity.ok(fichas);
    }

    /**
     * Endpoint REST para buscar detalhes de uma ficha/receita por ID.
     */
    @GetMapping("/api/receitas/{id}")
    @ResponseBody
    public ResponseEntity<Ficha> buscarReceitaPorId(@PathVariable("id") Long id, HttpSession session) {
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return fichasService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}