package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.*;
import com.application.WebApplicationSIGEC.repository.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HomeService {

    private final AgendamentoRepository agendamentoRepository;
    private final InsumoRepository insumoRepository;
    private final InsumoFichaRepository insumoFichaRepository;
    private final ChecklistUtensilioRepository checklistUtensilioRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final EntityManager entityManager;

    public HomeService(AgendamentoRepository agendamentoRepository,
                       InsumoRepository insumoRepository,
                       InsumoFichaRepository insumoFichaRepository,
                       ChecklistUtensilioRepository checklistUtensilioRepository,
                       MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
                       EntityManager entityManager) {
        this.agendamentoRepository = agendamentoRepository;
        this.insumoRepository = insumoRepository;
        this.insumoFichaRepository = insumoFichaRepository;
        this.checklistUtensilioRepository = checklistUtensilioRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.entityManager = entityManager;
    }

    // ==========================================
    // ADAPTAÇÃO: Busca de Aulas (Sem turma_ficha)
    // ==========================================

    // Busca as aulas agendadas para o dia, filtrando pelo utilizador e pela turma
    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario, Long idTurma) {
        return agendamentoRepository.findAgendamentosDoUsuarioPorData(data, idUsuario, idTurma);
    }

    // Busca as aulas agendadas para a semana, filtrando pelo utilizador e pela turma
    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDaSemana(LocalDate inicio, LocalDate fim, Long idUsuario, Long idTurma) {
        return agendamentoRepository.buscarAgendamentosDaSemana(inicio, fim, idUsuario, idTurma);
    }

    // ==========================================
    // FLUXO DE INSUMOS E UTENSÍLIOS (MANTIDOS INTACTOS)
    // ==========================================

    @Transactional(readOnly = true)
    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId) {
        Map<String, Object> detalhes = new HashMap<>();

        List<?> insumos = montarInsumosDaFicha(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);
        List<Long> insumosSeparados = buscarInsumosSeparadosHoje(fichaId);

        detalhes.put("insumos", insumos);
        detalhes.put("utensilios", utensilios);
        detalhes.put("insumosSeparados", insumosSeparados);

        return detalhes;
    }

    private List<?> montarInsumosDaFicha(Long fichaId) {
        List<InsumoFicha> itens = insumoFichaRepository.findByFichaId(fichaId);

        Set<Long> idsProdutos = itens.stream()
                .map(item -> item.getProduto().getId())
                .collect(Collectors.toSet());

        Map<Long, Double> estoquePorProduto = new HashMap<>();
        if (!idsProdutos.isEmpty()) {
            for (Object[] linha : insumoRepository.somarEstoquePorProduto(idsProdutos)) {
                estoquePorProduto.put(((Number) linha[0]).longValue(), ((Number) linha[1]).doubleValue());
            }
        }

        return itens.stream().map(item -> {
            Produto p = item.getProduto();

            Map<String, Object> produto = new LinkedHashMap<>();
            produto.put("id", p.getId());
            produto.put("nomeProduto", p.getNomeProduto());
            produto.put("unidade", p.getUnidade());
            produto.put("quantidade", estoquePorProduto.getOrDefault(p.getId(), 0.0));

            Map<String, Object> insumo = new LinkedHashMap<>();
            insumo.put("id", item.getId());
            insumo.put("quantidade", item.getQuantidade());
            insumo.put("unidadeMedida", item.getUnidadeMedida());
            insumo.put("produto", produto);
            return insumo;
        }).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private List<Long> buscarInsumosSeparadosHoje(Long fichaId) {
        List<Object> ids = entityManager.createNativeQuery("""
                SELECT DISTINCT f.id_insumo_ficha
                FROM insumo_ficha f
                JOIN movimentacao_estoque m ON m.id_produto = f.id_produto
                WHERE f.id_ficha = :fichaId
                  AND m.tipo_movimentacao = 'SAIDA'
                  AND DATE(m.data_movimentacao) = CURDATE()
                """)
                .setParameter("fichaId", fichaId)
                .getResultList();

        return ids.stream()
                .map(id -> ((Number) id).longValue())
                .collect(Collectors.toList());
    }

    @Transactional
    public void confirmarSeparacaoInsumos(List<Long> insumoFichaIds, String observacaoGeral) {
        String obs = (observacaoGeral != null && !observacaoGeral.trim().isEmpty())
                ? observacaoGeral
                : "Baixa confirmada pelo instrutor via Web";

        for (Long idInsumoFicha : insumoFichaIds) {
            InsumoFicha item = insumoFichaRepository.findById(idInsumoFicha).orElse(null);
            if (item == null || item.getProduto() == null || item.getFicha() == null) {
                continue;
            }

            if (buscarInsumosSeparadosHoje(item.getFicha().getId()).contains(item.getId())) {
                continue;
            }

            Produto produto = item.getProduto();
            int necessario = item.getQuantidade() == null ? 0 : item.getQuantidade();

            if (necessario <= 0) {
                registrarSaida(produto, null, 0, obs);
                continue;
            }

            List<Insumo> lotes = insumoRepository.findLotesDisponiveis(produto.getId());
            int disponivel = lotes.stream().mapToInt(Insumo::getQuantidade).sum();

            if (disponivel < necessario) {
                throw new IllegalArgumentException("Estoque insuficiente de '" + produto.getNomeProduto()
                        + "': necessário " + necessario + ", disponível " + disponivel + ".");
            }

            int faltaBaixar = necessario;
            for (Insumo lote : lotes) {
                if (faltaBaixar <= 0) {
                    break;
                }
                int baixa = Math.min(lote.getQuantidade(), faltaBaixar);

                lote.setQuantidade(lote.getQuantidade() - baixa);
                insumoRepository.save(lote);

                registrarSaida(produto, lote, baixa, obs);
                faltaBaixar -= baixa;
            }
        }
    }

    private void registrarSaida(Produto produto, Insumo lote, int quantidade, String observacao) {
        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setTipoMovimentacao("SAIDA");
        mov.setQuantidade(BigDecimal.valueOf(quantidade));
        mov.setDataMovimentacao(LocalDateTime.now());
        mov.setProduto(produto);
        mov.setInsumo(lote);
        mov.setObservacao(observacao);

        movimentacaoEstoqueRepository.save(mov);
    }

    @Transactional
    public void confirmarSaidaUtensilios(List<Long> checklistIds) {
        for (Long id : checklistIds) {
            ChecklistUtensilio checklist = checklistUtensilioRepository.findById(id).orElse(null);
            if (checklist != null && checklist.getDataHoraSaida() != null && checklist.getDataHoraEntrada() == null) {
                throw new IllegalArgumentException("O utensílio já está em uso.");
            }

            if (checklist != null) {
                checklist.setDataHoraSaida(LocalDateTime.now());
                checklist.setDataHoraEntrada(null);
                checklist.setObservacao("Retirado para aula");
                checklistUtensilioRepository.save(checklist);
            }
        }
    }

    @Transactional
    public void registrarDevolucaoUtensilio(List<Long> checklistIds, String estadoAtual, String observacao) {
        for (Long id : checklistIds) {
            ChecklistUtensilio checklist = checklistUtensilioRepository.findById(id).orElse(null);
            if (checklist != null) {
                checklist.setEstadoAnterior(checklist.getEstadoAtual());
                checklist.setEstadoAtual(estadoAtual);
                checklist.setObservacao(observacao);
                checklist.setDataHoraEntrada(LocalDateTime.now());
                checklistUtensilioRepository.save(checklist);
            }
        }
    }

    // ==========================================
    // SOLICITAÇÕES EXTRA (MANTIDOS INTACTOS)
    // ==========================================

    @Transactional
    public void salvarSolicitacaoInsumoExtra(Long idUsuario, Long idTurma, String nomeInsumo, Double quantidade, String unidadeMedida, String justificativa) {
        Long idInsumo;

        try {
            String buscaSql = """
                    SELECT i.id_insumo
                    FROM insumo i
                    JOIN produto p ON i.id_produto = p.id_produto
                    WHERE p.nome_produto = :nome
                    ORDER BY i.cancelado ASC, i.data_validade DESC, i.id_insumo DESC
                    LIMIT 1
                    """;
            idInsumo = ((Number) entityManager.createNativeQuery(buscaSql)
                    .setParameter("nome", nomeInsumo)
                    .getSingleResult()).longValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("O item '" + nomeInsumo + "' não foi encontrado no estoque. Certifique-se de que o produto está cadastrado e possui lote.");
        }

        String sql = "INSERT INTO solicitacao_insumo (id_usuario, id_turma, id_insumo, data_solicitacao, quantidade, unidade_medida, justificativa, situacao) " +
                "VALUES (:usuario, :turma, :idI, NOW(), :qtd, :unidade, :just, 'N')";

        entityManager.createNativeQuery(sql)
                .setParameter("usuario", idUsuario)
                .setParameter("turma", idTurma)
                .setParameter("idI", idInsumo)
                .setParameter("qtd", quantidade)
                .setParameter("unidade", unidadeMedida)
                .setParameter("just", justificativa)
                .executeUpdate();
    }

    @Transactional
    public void salvarSolicitacaoUtensilioExtra(Long idUsuario, Long idTurma, String nomeUtensilio, Integer quantidade, String justificativa) {
        Long idUtensilio;

        try {
            String buscaSql = "SELECT id_utensilio FROM utensilio WHERE nome_utensilio = :nome LIMIT 1";
            idUtensilio = ((Number) entityManager.createNativeQuery(buscaSql)
                    .setParameter("nome", nomeUtensilio)
                    .getSingleResult()).longValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("O utensílio '" + nomeUtensilio + "' não existe no banco de dados. Cadastre-o primeiro no painel de utensílios.");
        }

        String sql = "INSERT INTO solicitacao_utensilio (id_usuario, id_turma, id_utensilio, data_solicitacao, quantidade, justificativa, situacao) " +
                "VALUES (:usuario, :turma, :idU, NOW(), :qtd, :just, 'N')";

        entityManager.createNativeQuery(sql)
                .setParameter("usuario", idUsuario)
                .setParameter("turma", idTurma)
                .setParameter("idU", idUtensilio)
                .setParameter("qtd", quantidade)
                .setParameter("just", justificativa)
                .executeUpdate();
    }
}
