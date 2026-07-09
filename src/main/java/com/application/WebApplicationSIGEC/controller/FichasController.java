package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;

import com.application.WebApplicationSIGEC.service.FichasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.*;

@Controller
@RequestMapping("/")
public class FichasController {

    @Autowired
    private FichasRepository fichasRepository;
    @Autowired
    private FichasService fichasService;

    @GetMapping("/calendario")
    public String exibirCalendario(Model model) {
        return "calendario";
    }

    @GetMapping("/calendario/fichas")
    public ResponseEntity<Map<String, Object>> exibirFichaData(
            @RequestParam("data") String data,
            @RequestParam("idTurma") int idTurma) { // <-- Novo parâmetro que vem do Select/Checkbox da tela
        LocalDate dataSelecionada = LocalDate.parse(data);
        List<Fichas> rs = fichasRepository.findByDataAndTurmasId(dataSelecionada, idTurma);
        List<Fichas> rsall = fichasRepository.findByDataIsNullAndTurmasIsNull();
        Map<String, Object> rsFinal = new HashMap<>();
        rsFinal.put("alocadas", rs);
        rsFinal.put("Disponiveis", rsall);

        return ResponseEntity.ok(rsFinal);
    }

    @GetMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha(
            @RequestParam("id") int id,
            @RequestParam("data") String dataFinal,
            @RequestParam("idTurma") int idTurma) {
        LocalDate novaData = LocalDate.parse(dataFinal);
        fichasService.alocarFicha(id, novaData, idTurma);
        return ResponseEntity.ok("Receita atualizada com sucesso!");
    }

    @GetMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha(@RequestParam("id") int id) {
        fichasService.desalocarFicha(id);
        return ResponseEntity.ok("Receita desalocada com sucesso!");
    }
}
