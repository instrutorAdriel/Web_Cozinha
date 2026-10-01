package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.service.FichasService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class FichasController {

    private final FichasService fichasService;

    // Injeção via construtor
    public FichasController(FichasService fichasService) {
        this.fichasService = fichasService;
    }

    @GetMapping("/calendario")
    public String exibirCalendario(HttpSession session) {

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        return "calendario";
    }

    @GetMapping("/calendario/fichas")
    public ResponseEntity<Map<String, Object>> exibirFichaData(
            @RequestParam("data") String data) {

        LocalDate dataSelecionada = LocalDate.parse(data);

        // Fichas alocadas no dia selecionado
        List<Ficha> rs = fichasService.buscarData(dataSelecionada);

        // Somente fichas que ainda NÃO possuem data
        List<Ficha> rsall = fichasService.buscarDisponiveis();

        Map<String, Object> rsFinal = new HashMap<>();

        rsFinal.put("alocadas", rs);
        rsFinal.put("Disponiveis", rsall);

        return ResponseEntity.ok(rsFinal);
    }

    @GetMapping("/calendario/fichas-alocadas")
    public ResponseEntity<List<Ficha>> obterTodasFichasAlocadas() {

        // Somente fichas que possuem uma data
        List<Ficha> alocadas = fichasService.buscarAlocadas();

        return ResponseEntity.ok(alocadas);
    }

    @GetMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha(
            @RequestParam("id") Long id,
            @RequestParam("data") String dataFinal) {

        LocalDate novaData = LocalDate.parse(dataFinal);

        fichasService.alocarFicha(id, novaData);

        return ResponseEntity.ok("Receita atualizada com sucesso!");
    }

    @PostMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha(
            @RequestParam("id") Long id,
            HttpSession session) {

        if (session == null || session.getAttribute("usuarioLogado") == null) {

            return ResponseEntity
                    .status(401)
                    .body("Acesso negado: Usuário não autenticado.");
        }

        fichasService.desalocarFicha(id);

        return ResponseEntity.ok("Receita desalocada com sucesso!");
    }
}