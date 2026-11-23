package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Notificacao;
import com.application.WebApplicationSIGEC.model.SolicitacaoInsumo;
import com.application.WebApplicationSIGEC.model.SolicitacaoUtensilio;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.repository.SolicitacaoInsumoRepository;
import com.application.WebApplicationSIGEC.repository.SolicitacaoUtensilioRepository;
import com.application.WebApplicationSIGEC.service.SessaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import java.time.LocalDate; // Descomente se ativar o filtro apenas de hoje
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final SolicitacaoInsumoRepository insumoRepository;
    private final SolicitacaoUtensilioRepository utensilioRepository;
    private final SessaoService sessaoService;

    public NotificacaoController(SolicitacaoInsumoRepository insumoRepository,
                                 SolicitacaoUtensilioRepository utensilioRepository,
                                 SessaoService sessaoService) {
        this.insumoRepository = insumoRepository;
        this.utensilioRepository = utensilioRepository;
        this.sessaoService = sessaoService;
    }

    @GetMapping
    public ResponseEntity<List<Notificacao>> listarNotificacoes(HttpSession session) {
        Usuario usuarioLogado = sessaoService.buscarUsuarioLogado(session);
        Long userId = usuarioLogado.getId();
        String hojePrefixo = LocalDate.now() + "%";

        List<Notificacao> notificacoes = new ArrayList<>();
        List<SolicitacaoInsumo> insumos = insumoRepository.buscarDoDiaPorUsuario(userId, hojePrefixo);

        for (SolicitacaoInsumo ins : insumos) {
            String nomeProduto = (ins.getId_insumo() != null && ins.getId_insumo().getProduto() != null)
                    ? ins.getId_insumo().getProduto().getNomeProduto()
                    : "Insumo";
            String nomeTurma = (ins.getId_turma() != null) ? ins.getId_turma().getNomeTurma() : "";
            String unidade = (ins.getUnidade_medida() != null) ? ins.getUnidade_medida() : "";
            String detalhe = nomeProduto + " - " + ins.getQuantidade() + " " + unidade + " (" + nomeTurma + ")";

            notificacoes.add(new Notificacao(
                    ins.getId(),
                    "Insumo",
                    detalhe,
                    ins.getSituacao(),
                    ins.getData_solicitacao()
            ));
        }

        List<SolicitacaoUtensilio> utensilios = utensilioRepository.buscarDoDiaPorUsuario(userId, hojePrefixo);

        for (SolicitacaoUtensilio ut : utensilios) {
            String nomeUtensilio = (ut.getId_utensilio() != null && ut.getId_utensilio().getNomeUtensilio() != null)
                    ? ut.getId_utensilio().getNomeUtensilio()
                    : "Utensílio";
            String nomeTurma = (ut.getId_turma() != null) ? ut.getId_turma().getNomeTurma() : "";
            String detalhe = nomeUtensilio + " - " + ut.getQuantidade() + " UN (" + nomeTurma + ")";

            notificacoes.add(new Notificacao(
                    ut.getId(),
                    "Utensílio",
                    detalhe,
                    ut.getSituacao(),
                    ut.getData_solicitacao()
            ));
        }

        notificacoes.sort(
                Comparator.comparing(Notificacao::getDataSolicitacao, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(Notificacao::getId, Comparator.nullsLast(Comparator.reverseOrder()))
        );

        return ResponseEntity.ok(notificacoes);
    }
}