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
import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final AgendamentoRepository agendamentoRepository;
    private final InsumoRepository insumoRepository;
    private final ChecklistUtensilioRepository checklistUtensilioRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final EntityManager entityManager;

    public HomeService(AgendamentoRepository agendamentoRepository,
                       InsumoRepository insumoRepository,
                       ChecklistUtensilioRepository checklistUtensilioRepository,
                       ProdutoRepository produtoRepository,
                       MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
                       EntityManager entityManager) {
        this.agendamentoRepository = agendamentoRepository;
        this.insumoRepository = insumoRepository;
        this.checklistUtensilioRepository = checklistUtensilioRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.entityManager = entityManager;
    }

    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario) {
        return agendamentoRepository.findAgendamentosDoUsuarioHoje(data, idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDaSemana(LocalDate inicio, LocalDate fim, Long idUsuario) {
        return agendamentoRepository.buscarAgendamentosDaSemana(inicio, fim, idUsuario);
    }

    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId) {
        Map<String, Object> detalhes = new HashMap<>();
        List<Insumo> insumos = insumoRepository.findByFichaId(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);
        List<Long> insumosSeparados = movimentacaoEstoqueRepository.findInsumosSeparadosHoje(fichaId);

        detalhes.put("insumos", insumos);
        detalhes.put("utensilios", utensilios);
        detalhes.put("insumosSeparados", insumosSeparados);
        return detalhes;
    }

    @Transactional
    public void confirmarSeparacaoInsumos(List<Long> insumoIds, String observacaoGeral) {
        for (Long id : insumoIds) {
            Insumo insumo = insumoRepository.findById(id).orElse(null);
            if (insumo != null && insumo.getProduto() != null) {
                List<Long> jaSeparados = movimentacaoEstoqueRepository.findInsumosSeparadosHoje(insumo.getFicha().getId());
                if (jaSeparados.contains(id)) {
                    continue;
                }
                Produto produto = insumo.getProduto();
                BigDecimal qtdNecessaria = new BigDecimal(insumo.getQuantidade());

                produto.setQuantidade(produto.getQuantidade().subtract(qtdNecessaria));
                produtoRepository.save(produto);

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

    // ========================================================
    // SALVAMENTO DE INSUMO EXTRA
    // ========================================================
    @Transactional
    public void salvarSolicitacaoInsumoExtra(Long idUsuario, Long idTurma, String nomeInsumo, Double quantidade, String unidadeMedida, String justificativa) {
        Long idInsumo = null;

        try {
            // Busca o id_insumo cruzando com a tabela produto
            String buscaSql = "SELECT i.id_insumo FROM insumo i JOIN produto p ON i.id_produto = p.id_produto WHERE p.nome_produto = :nome LIMIT 1";
            idInsumo = ((Number) entityManager.createNativeQuery(buscaSql)
                    .setParameter("nome", nomeInsumo)
                    .getSingleResult()).longValue();
        } catch (Exception e) {
            // Retorna um erro amigável para o front-end exibir no popup
            throw new IllegalArgumentException("O item '" + nomeInsumo + "' não foi encontrado. Certifique-se de que o produto está cadastrado no sistema.");
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
    // SALVAMENTO DE UTENSÍLIO EXTRA
    // ========================================================
    @Transactional
    public void salvarSolicitacaoUtensilioExtra(Long idUsuario, Long idTurma, String nomeUtensilio, Integer quantidade, String justificativa) {
        Long idUtensilio = null;

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