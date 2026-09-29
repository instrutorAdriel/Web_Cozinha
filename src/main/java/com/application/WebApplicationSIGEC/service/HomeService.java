package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.*;
import com.application.WebApplicationSIGEC.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final AgendamentoRepository agendamentoRepository;
    private final InsumoRepository insumoRepository;
    private final ChecklistUtensilioRepository checklistUtensilioRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public HomeService(AgendamentoRepository agendamentoRepository,
                       InsumoRepository insumoRepository,
                       ChecklistUtensilioRepository checklistUtensilioRepository,
                       ProdutoRepository produtoRepository,
                       MovimentacaoEstoqueRepository movimentacaoEstoqueRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.insumoRepository = insumoRepository;
        this.checklistUtensilioRepository = checklistUtensilioRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
    }

    // Busca as aulas agendadas para a data informada E para o usuário logado
    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario) {
        return agendamentoRepository.findAgendamentosDoUsuarioHoje(data, idUsuario);
    }

    // Busca insumos e utensílios referentes a uma ficha técnica
    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId) {
        Map<String, Object> detalhes = new HashMap<>();

        List<Insumo> insumos = insumoRepository.findByFichaId(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);

        detalhes.put("insumos", insumos);
        detalhes.put("utensilios", utensilios);

        return detalhes;
    }

    @Transactional
    public void confirmarSeparacaoInsumos(List<Long> insumoIds, String observacaoGeral) {
        for (Long id : insumoIds) {
            Insumo insumo = insumoRepository.findById(id).orElse(null);

            if (insumo != null && insumo.getProduto() != null) {
                Produto produto = insumo.getProduto();
                BigDecimal qtdNecessaria = new BigDecimal(insumo.getQuantidade());

                // Subtrai do produto
                produto.setQuantidade(produto.getQuantidade().subtract(qtdNecessaria));
                produtoRepository.save(produto);

                // Registra na tabela movimentacao_estoque
                MovimentacaoEstoque mov = new MovimentacaoEstoque();
                mov.setTipoMovimentacao("SAIDA");
                mov.setQuantidade(qtdNecessaria);
                mov.setDataMovimentacao(LocalDateTime.now());
                mov.setProduto(produto);
                mov.setInsumo(insumo);

                String obs = (observacaoGeral != null && !observacaoGeral.trim().isEmpty())
                        ? observacaoGeral
                        : "Baixa confirmada pelo instrutor via Web";
                mov.setObservacao(obs);

                movimentacaoEstoqueRepository.save(mov);
            }
        }
    }

    // Registra a SAÍDA dos utensílios para a aula

    @Transactional
    public void confirmarSaidaUtensilios(List<Long> checklistIds) {
        for (Long id : checklistIds) {
            ChecklistUtensilio checklist = checklistUtensilioRepository.findById(id).orElse(null);
            if (checklist != null) {
                checklist.setDataHoraSaida(LocalDateTime.now());
                checklist.setObservacao("Retirado para aula"); // <-- Adiciona a observação
                checklistUtensilioRepository.save(checklist);
            }
        }
    }

    // Registra a DEVOLUÇÃO (Entrada) dos utensílios em lote (múltiplos)
    @Transactional
    public void registrarDevolucaoUtensilio(List<Long> checklistIds, String estadoAtual, String observacao) {
        for (Long id : checklistIds) {
            ChecklistUtensilio checklist = checklistUtensilioRepository.findById(id).orElse(null);
            if (checklist != null) {
                // Salva o estado atual antigo como anterior, e atualiza o novo
                checklist.setEstadoAnterior(checklist.getEstadoAtual());
                checklist.setEstadoAtual(estadoAtual);
                checklist.setObservacao(observacao);
                checklist.setDataHoraEntrada(LocalDateTime.now());
                checklistUtensilioRepository.save(checklist);
            }
        }
    }
}