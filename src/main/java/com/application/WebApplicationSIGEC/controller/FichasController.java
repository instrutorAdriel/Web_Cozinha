package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.service.FichasService;

import jakarta.servlet.http.HttpSession;


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

    @GetMapping("/calendario/fichas-alocadas")
    public ResponseEntity<List<Fichas>> obterTodasFichasAlocadas() {
        List<Fichas> alocadas = fichasRepository.findByDataIsNotNull();
        return ResponseEntity.ok(alocadas);
    }

    @GetMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha (@RequestParam("id") int id, @RequestParam("data") String dataFinal){
        LocalDate novaData = LocalDate.parse(dataFinal);
        fichasService.alocarFicha(id, novaData);
        return ResponseEntity.ok("Receita atualizada com sucesso!");
    }

        @PostMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha (@RequestParam("id") int id, HttpSession session){
        // Validação de segurança no Back-End (Impede requisições de usuários deslogados)
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            return ResponseEntity.status(401).body("Acesso negado: Usuário não autenticado.");
        }

        // Processa a regra de negócio segura via JPA
        fichasService.desalocarFicha(id);
        return ResponseEntity.ok("Receita desalocada com sucesso!");
    }

    @GetMapping("/api/fichas/todas")
    @ResponseBody
    public ResponseEntity<List<Fichas>> listarTodasFichas() {
        List<Fichas> todasAsFichas = fichasRepository.findAll();
        return ResponseEntity.ok(todasAsFichas);
    }

    @GetMapping("/api/fichas/{id}")
    @ResponseBody
    public ResponseEntity buscarFichaPorId(@PathVariable int id) {
        // Usa o repositório que já está injetado na sua classe para buscar a ficha pelo ID
        Fichas ficha = fichasRepository.findById(id).orElse(null);
        return ResponseEntity.ok(ficha);
    }




}

