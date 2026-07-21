package com.application.WebApplicationSIGEC.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import com.application.WebApplicationSIGEC.service.AgendamentoService;
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

@Controller
@RequestMapping("/")
public class FichasController {

    @Autowired
    private FichasRepository fichasRepository;

    @Autowired
    private TurmasRepository turmasRepository;

    @Autowired
    private FichasService fichasService;

    @Autowired
    private SessaoService sessaoService;

    @GetMapping("/calendario")
    public String exibirCalendario(Model model, HttpSession session) {
        // CORRIGIDO: Agora usa a mesma validação do SessaoService
        if (sessaoService.buscarUsuarioLogado(session) == null) {
            return "redirect:/login";
        }
        return "calendario";
    }


    @GetMapping("/calendario/fichas")
    public ResponseEntity<Map<String, Object>> exibirFichaData(
            @RequestParam("data") String data,
            @RequestParam("idTurma") int idTurma) {

        LocalDate dataSelecionada = LocalDate.parse(data);
        List<Fichas> alocadas = fichasRepository.findByDataAndTurmasId(dataSelecionada, idTurma);
        List<Fichas> disponiveis = fichasRepository.findByDataIsNullAndTurmasIsNull();

        Map<String, Object> rsFinal = new HashMap<>();
        // Mapeado exatamente como o seu JS lê (Disponiveis com D maiúsculo se mantiver o JS)
        rsFinal.put("alocadas", alocadas);
        rsFinal.put("Disponiveis", disponiveis);

        return ResponseEntity.ok(rsFinal);
    }

    @GetMapping("/calendario/fichas-alocadas")
    public ResponseEntity<List<Fichas>> obterTodasFichasAlocadas() {
        List<Fichas> alocadas = fichasRepository.findAll().stream()
                .filter(f -> f.getData() != null)
                .toList();
        return ResponseEntity.ok(alocadas);
    }

    @GetMapping("/calendario/alocar")
    @ResponseBody
    public ResponseEntity<String> alocarFicha(
            @RequestParam("id") int id,
            @RequestParam("data") String dataFinal,
            @RequestParam("idTurma") int idTurma) {

        LocalDate novaData = LocalDate.parse(dataFinal);
        fichasService.alocarFicha(id, novaData, idTurma);
        return ResponseEntity.ok("Receita alocada com sucesso!");
    }

    @GetMapping("/calendario/desalocar")
    @ResponseBody
    public ResponseEntity<String> desalocarFicha(
            @RequestParam("id") int id,
            @RequestParam("idTurma") int idTurma) {

        fichasService.desalocarFicha(id, idTurma);
        return ResponseEntity.ok("Receita desalocada com sucesso!");
    }
}