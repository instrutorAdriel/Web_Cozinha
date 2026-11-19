package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Notificacao;
import com.application.WebApplicationSIGEC.model.SolicitacaoInsumo;
import com.application.WebApplicationSIGEC.model.SolicitacaoUtensilio;
import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.repository.SolicitacaoInsumoRepository;
import com.application.WebApplicationSIGEC.repository.SolicitacaoUtensilioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private SolicitacaoInsumoRepository insumoRepository;

    @Autowired
    private SolicitacaoUtensilioRepository utensilioRepository;

    @GetMapping
    public List<Notificacao> listarNotificacoes(HttpSession session) {
        List<Notificacao> notificacoes = new ArrayList<>();
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return notificacoes;
        }

        if ("P".equalsIgnoreCase(usuarioLogado.getAcesso())) {
            Long userId = usuarioLogado.getId();

            // 1. Insumos do Professor
            List<SolicitacaoInsumo> insumos = insumoRepository.buscarPorUsuario(userId);
            for (SolicitacaoInsumo ins : insumos) {
                String nomeProduto = (ins.getId_insumo() != null && ins.getId_insumo().getProduto() != null)
                        ? ins.getId_insumo().getProduto().getNomeProduto()
                        : "Insumo";
                String nomeTurma = (ins.getId_turma() != null) ? ins.getId_turma().getNomeTurma() : "";
                String detalhe = nomeProduto + " - " + ins.getQuantidade() + " " + (ins.getUnidade_medida() != null ? ins.getUnidade_medida() : "") + " (" + nomeTurma + ")";

                notificacoes.add(new Notificacao(ins.getId(), "Insumo", detalhe, ins.getSituacao(), ins.getData_solicitacao()));
            }

            // 2. Utensílios do Professor
            List<SolicitacaoUtensilio> utensilios = utensilioRepository.buscarPorUsuario(userId);
            for (SolicitacaoUtensilio ut : utensilios) {
                String nomeUtensilio = (ut.getId_insumo() != null && ut.getId_insumo().getProduto() != null)
                        ? ut.getId_insumo().getProduto().getNomeProduto()
                        : "Utensílio";
                String nomeTurma = (ut.getId_turma() != null) ? ut.getId_turma().getNomeTurma() : "";
                String detalhe = nomeUtensilio + " - " + ut.getQuantidade() + " UN (" + nomeTurma + ")";

                notificacoes.add(new Notificacao(ut.getId(), "Utensílio", detalhe, ut.getSituacao(), ut.getData_solicitacao()));
            }
        } else {
            // Gestão / Estoque: busca todas as solicitações (Insumos e Utensílios)
            List<SolicitacaoInsumo> insumos = insumoRepository.findAll();
            for (SolicitacaoInsumo ins : insumos) {
                String nomeProduto = (ins.getId_insumo() != null && ins.getId_insumo().getProduto() != null)
                        ? ins.getId_insumo().getProduto().getNomeProduto()
                        : "Insumo";
                String nomeTurma = (ins.getId_turma() != null) ? ins.getId_turma().getNomeTurma() : "";
                String detalhe = nomeProduto + " - " + ins.getQuantidade() + " " + (ins.getUnidade_medida() != null ? ins.getUnidade_medida() : "") + " (" + nomeTurma + ")";

                notificacoes.add(new Notificacao(ins.getId(), "Insumo", detalhe, ins.getSituacao(), ins.getData_solicitacao()));
            }

            List<SolicitacaoUtensilio> utensilios = utensilioRepository.findAll();
            for (SolicitacaoUtensilio ut : utensilios) {
                String nomeUtensilio = (ut.getId_insumo() != null && ut.getId_insumo().getProduto() != null)
                        ? ut.getId_insumo().getProduto().getNomeProduto()
                        : "Utensílio";
                String nomeTurma = (ut.getId_turma() != null) ? ut.getId_turma().getNomeTurma() : "";
                String detalhe = nomeUtensilio + " - " + ut.getQuantidade() + " UN (" + nomeTurma + ")";

                notificacoes.add(new Notificacao(ut.getId(), "Utensílio", detalhe, ut.getSituacao(), ut.getData_solicitacao()));
            }
        }

        return notificacoes;
    }
}