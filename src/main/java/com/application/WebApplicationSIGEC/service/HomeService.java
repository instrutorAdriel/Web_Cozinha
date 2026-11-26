package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.*;
import com.application.WebApplicationSIGEC.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HomeService {

    private static final DateTimeFormatter FORMATO_DATA_HORA = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final AgendamentoRepository agendamentoRepository;
    private final InsumoRepository insumoRepository;
    private final InsumoFichaRepository insumoFichaRepository;
    private final ChecklistUtensilioRepository checklistUtensilioRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final UtensilioRepository utensilioRepository;
    private final ProdutoRepository produtoRepository;
    private final SolicitacaoInsumoRepository solicitacaoInsumoRepository;
    private final SolicitacaoUtensilioRepository solicitacaoUtensilioRepository;
    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;
    private final CursoFichaRepository cursoFichaRepository;

    public HomeService(AgendamentoRepository agendamentoRepository,
                       InsumoRepository insumoRepository,
                       InsumoFichaRepository insumoFichaRepository,
                       ChecklistUtensilioRepository checklistUtensilioRepository,
                       MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
                       UtensilioRepository utensilioRepository,
                       ProdutoRepository produtoRepository,
                       SolicitacaoInsumoRepository solicitacaoInsumoRepository,
                       SolicitacaoUtensilioRepository solicitacaoUtensilioRepository,
                       UsuarioRepository usuarioRepository,
                       TurmaRepository turmaRepository, CursoFichaRepository cursoFichaRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.insumoRepository = insumoRepository;
        this.insumoFichaRepository = insumoFichaRepository;
        this.checklistUtensilioRepository = checklistUtensilioRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.utensilioRepository = utensilioRepository;
        this.produtoRepository = produtoRepository;
        this.solicitacaoInsumoRepository = solicitacaoInsumoRepository;
        this.solicitacaoUtensilioRepository = solicitacaoUtensilioRepository;
        this.usuarioRepository = usuarioRepository;
        this.turmaRepository = turmaRepository;
        this.cursoFichaRepository = cursoFichaRepository;
    }

    // ==========================================
    // BUSCA DE AULAS
    // ==========================================

    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDoDia(LocalDate data, Long idUsuario, Long idTurma) {
        return agendamentoRepository.findAgendamentosDoUsuarioPorData(data, idUsuario, idTurma);
    }

    @Transactional(readOnly = true)
    public List<Agendamento> buscarAulasDaSemana(LocalDate inicio, LocalDate fim, Long idUsuario, Long idTurma) {
        return agendamentoRepository.buscarAgendamentosDaSemana(inicio, fim, idUsuario, idTurma);
    }

    // ==========================================
    // FLUXO DE INSUMOS E UTENSÍLIOS
    // ==========================================

    @Transactional(readOnly = true)
    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId, Long idTurma) {
        Map<String, Object> detalhes = new HashMap<>();

        List<?> insumos = montarInsumosDaFicha(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);
        List<Long> insumosSeparados = Collections.emptyList();
        if (idTurma != null) {
            Turma turma = turmaRepository.findById(idTurma).orElse(null);
            if (turma != null && turma.getCurso() != null) {
                insumosSeparados = insumoFichaRepository.buscarIdsSeparadosHoje(fichaId, turma.getCurso().getId());
            }
        }

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

    @Transactional
    public void confirmarSeparacaoInsumos(List<Long> insumoFichaIds, Long idTurma, String observacaoGeral) {

        if (insumoFichaIds == null || insumoFichaIds.isEmpty()) {
            throw new IllegalArgumentException("Nenhum insumo selecionado.");
        }
        if (idTurma == null) {
            throw new IllegalArgumentException("Turma não informada para confirmar a separação.");
        }

        Turma turma = turmaRepository.findById(idTurma)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada."));

        Curso curso = turma.getCurso();
        if (curso == null) {
            throw new IllegalArgumentException("A turma '" + turma.getNomeTurma() + "' não possui curso vinculado.");
        }

        String obs = (observacaoGeral != null && !observacaoGeral.trim().isEmpty())
                ? observacaoGeral
                : "Baixa confirmada pelo instrutor via Web";

        for (Long idInsumoFicha : insumoFichaIds) {
            InsumoFicha item = insumoFichaRepository.findById(idInsumoFicha).orElse(null);
            if (item == null || item.getProduto() == null || item.getFicha() == null) {
                continue;
            }

            Long fichaId = item.getFicha().getId();

            // 1. Busca o vínculo exato (Curso + Ficha) que será gravado em movimentacao_estoque
            CursoFicha cursoFicha = cursoFichaRepository.findByCurso_IdAndFicha_Id(curso.getId(), fichaId)
                    .orElseThrow(() -> new IllegalArgumentException("A ficha '" + item.getFicha().getNomeFicha()
                            + "' não pertence ao curso '" + curso.getNomeCurso() + "'."));

            // 2. Passa os 2 parâmetros (fichaId e cursoId) na verificação
            if (insumoFichaRepository.buscarIdsSeparadosHoje(fichaId, curso.getId()).contains(item.getId())) {
                continue;
            }

            Produto produto = item.getProduto();
            int necessario = item.getQuantidade() == null ? 0 : item.getQuantidade();

            if (necessario <= 0) {
                // 3. Repassa cursoFicha para gravar id_curso_ficha
                registrarSaida(produto, null, cursoFicha, 0, obs);
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

                // 3. Repassa cursoFicha para gravar id_curso_ficha
                registrarSaida(produto, lote, cursoFicha, baixa, obs);
                faltaBaixar -= baixa;
            }
        }
    }

    private void registrarSaida(Produto produto, Insumo lote, CursoFicha cursoFicha, int quantidade, String observacao) {
        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setTipoMovimentacao("SAIDA");
        mov.setQuantidade(BigDecimal.valueOf(quantidade));
        mov.setDataMovimentacao(LocalDateTime.now());
        mov.setProduto(produto);
        mov.setInsumo(lote);
        mov.setCursoFicha(cursoFicha);
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
    // SOLICITAÇÕES EXTRA
    // ==========================================

    @Transactional
    public void salvarSolicitacaoInsumoExtra(Long idUsuario,
                                             Long idTurma,
                                             String nomeInsumo,
                                             Double quantidade,
                                             String unidadeMedida,
                                             String justificativa) {
        if (nomeInsumo == null || nomeInsumo.isBlank()) {
            throw new IllegalArgumentException("Informe o nome do insumo.");
        }
        if (quantidade == null || quantidade.intValue() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Turma turma = turmaRepository.findById(idTurma)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada."));

        Insumo insumo = insumoRepository.buscarPorNomeProdutoOrdenado(nomeInsumo)
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Produto produto = produtoRepository
                            .findByNomeProdutoContainingIgnoreCaseAndSituacao(nomeInsumo.trim(), "A")
                            .stream()
                            .filter(p -> p.getNomeProduto() != null && p.getNomeProduto().trim().equalsIgnoreCase(nomeInsumo.trim()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "O item '" + nomeInsumo + "' não foi encontrado no estoque."
                            ));

                    Insumo novoInsumo = new Insumo();
                    novoInsumo.setProduto(produto);
                    novoInsumo.setQuantidade(0);
                    novoInsumo.setQuantidadeMinima(0);
                    novoInsumo.setUnidadeMedida(unidadeMedida != null ? unidadeMedida : produto.getUnidade());
                    novoInsumo.setCancelado('N');
                    novoInsumo.setIdUnidade(1);
                    return insumoRepository.save(novoInsumo);
                });

        SolicitacaoInsumo solicitacao = new SolicitacaoInsumo();
        solicitacao.setId_usuario(usuario);
        solicitacao.setId_turma(turma);
        solicitacao.setId_insumo(insumo);
        solicitacao.setData_solicitacao(LocalDateTime.now().format(FORMATO_DATA_HORA));
        solicitacao.setQuantidade(quantidade.intValue());
        solicitacao.setUnidade_medida(unidadeMedida);
        solicitacao.setJustificativa(justificativa);
        solicitacao.setSituacao("P");

        solicitacaoInsumoRepository.save(solicitacao);
    }

    @Transactional
    public void salvarSolicitacaoUtensilioExtra(Long idUsuario,
                                                Long idTurma,
                                                String nomeUtensilio,
                                                Integer quantidade,
                                                String justificativa) {
        if (nomeUtensilio == null || nomeUtensilio.isBlank()) {
            throw new IllegalArgumentException("Informe o nome do utensílio.");
        }
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Turma turma = turmaRepository.findById(idTurma)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada."));

        Utensilio utensilio = utensilioRepository.findFirstByNomeUtensilioIgnoreCase(nomeUtensilio.trim())
                .orElseThrow(() -> new IllegalArgumentException(
                        "O utensílio '" + nomeUtensilio + "' não existe no banco de dados. Cadastre-o primeiro no painel de utensílios."
                ));

        SolicitacaoUtensilio solicitacao = new SolicitacaoUtensilio();
        solicitacao.setId_usuario(usuario);
        solicitacao.setId_turma(turma);
        solicitacao.setId_utensilio(utensilio);
        solicitacao.setData_solicitacao(LocalDateTime.now().format(FORMATO_DATA_HORA));
        solicitacao.setQuantidade(quantidade);
        solicitacao.setJustificativa(justificativa);
        solicitacao.setSituacao("P");

        solicitacaoUtensilioRepository.save(solicitacao);
    }
}