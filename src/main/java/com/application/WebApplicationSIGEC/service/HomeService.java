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

    // Busca as aulas agendadas para a data informada E para o usuário logado
    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario) {
        return agendamentoRepository.findAgendamentosDoUsuarioHoje(data, idUsuario);
    }

    // Busca as receitas agendadas durante a semana
    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDaSemana(LocalDate inicio, LocalDate fim, Long idUsuario) {
        return agendamentoRepository.buscarAgendamentosDaSemana(inicio, fim, idUsuario);
    }

    // Busca insumos e utensílios referentes a uma ficha técnica
    @Transactional(readOnly = true)
    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId) {
        Map<String, Object> detalhes = new HashMap<>();

        List<Map<String, Object>> insumos = montarInsumosDaFicha(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);
        List<Long> insumosSeparados = buscarInsumosSeparadosHoje(fichaId);

        detalhes.put("insumos", insumos);
        detalhes.put("utensilios", utensilios);
        detalhes.put("insumosSeparados", insumosSeparados);

        return detalhes;
    }

    // Ingredientes da ficha (insumo_ficha) com o estoque atual de cada produto (soma dos lotes em insumo).
    // Formato lido pelo scriptHome.js: { id, quantidade, produto: { nomeProduto, unidade, quantidade (= estoque) } }
    private List<Map<String, Object>> montarInsumosDaFicha(Long fichaId) {
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
            insumo.put("id", item.getId());                       // id_insumo_ficha
            insumo.put("quantidade", item.getQuantidade());       // quantidade necessária na receita
            insumo.put("unidadeMedida", item.getUnidadeMedida());
            insumo.put("produto", produto);
            return insumo;
        }).collect(Collectors.toList());
    }

    // ids de insumo_ficha desta ficha cujo produto já teve SAÍDA registrada hoje.
    // movimentacao_estoque não guarda a ficha, então o vínculo é pelo produto.
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

    // Confirma a separação: dá baixa nos lotes de insumo (FEFO) e registra a saída.
    // Os ids recebidos são de insumo_ficha (os mesmos ids dos checkboxes da checklist).
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

            // Pula o que já foi separado hoje
            if (buscarInsumosSeparadosHoje(item.getFicha().getId()).contains(item.getId())) {
                continue;
            }

            Produto produto = item.getProduto();
            int necessario = item.getQuantidade() == null ? 0 : item.getQuantidade();

            // Quantidade 0 na receita: só registra a saída para marcar como separado
            if (necessario <= 0) {
                registrarSaida(produto, null, 0, obs);
                continue;
            }

            List<Insumo> lotes = insumoRepository.findLotesDisponiveis(produto.getId());
            int disponivel = lotes.stream().mapToInt(Insumo::getQuantidade).sum();

            if (disponivel < necessario) {
                // Desfaz tudo (rollback) e devolve a mensagem ao front
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

    // Registra a SAÍDA dos utensílios para a aula
    @Transactional
    public void confirmarSaidaUtensilios(List<Long> checklistIds) {
        for (Long id : checklistIds) {
            ChecklistUtensilio checklist = checklistUtensilioRepository.findById(id).orElse(null);
            // Trava backend: impede que retirem o que já está na cozinha
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

    // ========================================================
    // SALVAMENTO DE INSUMO EXTRA  (tabela solicitacao_insumo)
    // ========================================================
    @Transactional
    public void salvarSolicitacaoInsumoExtra(Long idUsuario, Long idTurma, String nomeInsumo, Double quantidade, String unidadeMedida, String justificativa) {
        Long idInsumo;

        try {
            // solicitacao_insumo.id_insumo aponta para um lote em insumo:
            // usa o lote ativo mais recente do produto com esse nome.
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
            // Retorna um erro amigável para o front-end exibir no popup
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

    // ========================================================
    // SALVAMENTO DE UTENSÍLIO EXTRA  (tabela solicitacao_utensilio)
    // ========================================================
    @Transactional
    public void salvarSolicitacaoUtensilioExtra(Long idUsuario, Long idTurma, String nomeUtensilio, Integer quantidade, String justificativa) {
        Long idUtensilio;

        try {
            // Busca o id_utensilio diretamente pelo nome
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
