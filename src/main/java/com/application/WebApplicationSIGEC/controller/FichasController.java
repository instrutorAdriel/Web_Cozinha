package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;

import com.application.WebApplicationSIGEC.service.FichasService;
import com.application.WebApplicationSIGEC.service.SessaoService;
import jakarta.servlet.http.HttpSession;
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
    public String exibirCalendario(Model model, HttpSession session){

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login"; // Redireciona e PARA a execução
        }

        return "calendario";
    }

    @GetMapping("/calendario/fichas")
    public ResponseEntity<Map<String, Object>> exibirFichaData (@RequestParam("data") String data){
        LocalDate dataSelecionada = LocalDate.parse(data);
        List<Fichas> rs = fichasRepository.findByData(dataSelecionada);
        List<Fichas> rsall = fichasRepository.findByDataIsNull();
        Map<String, Object> rsFinal = new HashMap<>();
        rsFinal.put("alocadas", rs);
        rsFinal.put("Disponiveis", rsall);

        return ResponseEntity.ok(rsFinal);
    }

    @GetMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha (@RequestParam("id") int id, @RequestParam("data") String dataFinal){
        LocalDate novaData = LocalDate.parse(dataFinal);
        fichasService.alocarFicha(id, novaData);
        return ResponseEntity.ok("Receita atualizada com sucesso!");
    }

    @GetMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha (@RequestParam("id") int id){
        fichasService.desalocarFicha(id);
        return ResponseEntity.ok("Receita desalocada com sucesso!");
    }
}
