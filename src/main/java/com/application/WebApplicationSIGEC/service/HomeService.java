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

    // Busca as aulas agendadas para a data informada E para o usuário logado
    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario) {
        return agendamentoRepository.findAgendamentosDoUsuarioHoje(data, idUsuario);
    }

    // Busca as receitas agendadas durante a semana
    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDaSemana(LocalDate inicio, LocalDate fim, Long idUsuario, Long idTurma) {
        return agendamentoRepository.buscarAgendamentosDaSemana(inicio, fim, idUsuario, idTurma);
    }

    // Busca insumos e utensílios referentes a uma ficha técnica
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
                    continue; // Pula este item e vai para o próximo
                }

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
    // SALVAMENTO DE INSUMO EXTRA (Corrigido e Blindado)
    // ========================================================
    @Transactional
    public void salvarSolicitacaoInsumoExtra(Long idUsuario, Long idTurma, String nomeInsumo, Double quantidade, String unidadeMedida, String justificativa) {
        if (nomeInsumo == null || nomeInsumo.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do insumo não foi informado.");
        }

        // Busca o ID do produto de forma segura sem estourar NoResultException
        String buscaSql = "SELECT id_produto FROM produto WHERE LOWER(nome_produto) = LOWER(:nome) LIMIT 1";
        List<?> resultados = entityManager.createNativeQuery(buscaSql)
                .setParameter("nome", nomeInsumo.trim())
                .getResultList();

        if (resultados.isEmpty()) {
            throw new IllegalArgumentException("O item '" + nomeInsumo + "' não foi encontrado. Certifique-se de que o produto está cadastrado no sistema.");
        }

        Long idInsumo = ((Number) resultados.get(0)).longValue();
        int qtdInt = (quantidade != null) ? quantidade.intValue() : 0;

        // 'P' = Pendente para alinhar com a Central de Notificações
        String sql = "INSERT INTO solicitacao_insumo (id_usuario, id_turma, id_insumo, data_solicitacao, quantidade, unidade_medida, justificativa, situacao) " +
                "VALUES (:usuario, :turma, :idI, NOW(), :qtd, :unidade, :just, 'P')";

        entityManager.createNativeQuery(sql)
                .setParameter("usuario", idUsuario)
                .setParameter("turma", idTurma)
                .setParameter("idI", idInsumo)
                .setParameter("qtd", qtdInt)
                .setParameter("unidade", unidadeMedida)
                .setParameter("just", justificativa)
                .executeUpdate();

        entityManager.flush(); // Garante que a inserção seja efetuada no banco imediatamente
    }

    // ========================================================
    // SALVAMENTO DE UTENSÍLIO EXTRA (Corrigido e Blindado)
    // ========================================================
    @Transactional
    public void salvarSolicitacaoUtensilioExtra(Long idUsuario, Long idTurma, String nomeUtensilio, Integer quantidade, String justificativa) {
        if (nomeUtensilio == null || nomeUtensilio.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do utensílio não foi informado.");
        }

        // Busca o ID do utensílio de forma segura
        String buscaSql = "SELECT id_utensilio FROM utensilio WHERE LOWER(nome_utensilio) = LOWER(:nome) LIMIT 1";
        List<?> resultados = entityManager.createNativeQuery(buscaSql)
                .setParameter("nome", nomeUtensilio.trim())
                .getResultList();

        if (resultados.isEmpty()) {
            throw new IllegalArgumentException("O utensílio '" + nomeUtensilio + "' não existe no banco de dados. Cadastre-o primeiro no painel de utensílios.");
        }

        Long idUtensilio = ((Number) resultados.get(0)).longValue();
        int qtdInt = (quantidade != null) ? quantidade : 0;

        // 'P' = Pendente para alinhar com a Central de Notificações
        String sql = "INSERT INTO solicitacao_utensilio (id_usuario, id_turma, id_utensilio, data_solicitacao, quantidade, justificativa, situacao) " +
                "VALUES (:usuario, :turma, :idU, NOW(), :qtd, :just, 'P')";

        entityManager.createNativeQuery(sql)
                .setParameter("usuario", idUsuario)
                .setParameter("turma", idTurma)
                .setParameter("idU", idUtensilio)
                .setParameter("qtd", qtdInt)
                .setParameter("just", justificativa)
                .executeUpdate();

        entityManager.flush(); // Garante a sincronização do lote no banco
    }
}