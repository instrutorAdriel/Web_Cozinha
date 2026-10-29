package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmaFichaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final TurmaFichaRepository turmaFichaRepository;

    // Injeção do TurmaFichaRepository via Construtor
    public FichasService(FichasRepository fichasRepository,
                         AgendamentoRepository agendamentoRepository,
                         TurmaFichaRepository turmaFichaRepository) {
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
        this.turmaFichaRepository = turmaFichaRepository;
    }

    public Ficha buscarReceitas(String nomeFicha) {
        Optional<Ficha> rs = fichasRepository.findByNomeFicha(nomeFicha);
        return rs.orElse(null);
    }

    public List<Ficha> buscarTodas() {
        return fichasRepository.findAll();
    }

    public List<Ficha> buscarFichasPorUsuario(Long idUsuario) {
        return fichasRepository.findFichasByUsuarioId(idUsuario);
    }

    // Busca as receitas vinculadas à turma cruzando a tabela intermediária TurmaFicha (sem filtro de situacao)
    public List<Ficha> buscarPorTurma(Long idTurma) {
        return turmaFichaRepository.findFichasByTurmaId(idTurma);
    }

    // =========================================================
    // MÉTODOS DO CALENDÁRIO / AGENDAMENTO
    // =========================================================

    public List<Agendamento> buscarTodosAgendamentosDaTurma(Long idUsuario, Long idTurma) {
        if (idUsuario == null) return Collections.emptyList();
        return agendamentoRepository.buscarTodosPorUsuarioETurma(idUsuario, idTurma);
    }

    public List<Agendamento> buscarAgendamentosDoDia(Long idUsuario, Long idTurma, LocalDate data) {
        if (idUsuario == null || idTurma == null) return Collections.emptyList();
        return agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data);
    }

    public Map<String, Object> buscarFichasEDisponiveisDoDia(Long idUsuario, Long idTurma, LocalDate data) {
        // 1. Agendamentos específicos para a DATA SELECIONADA
        List<Agendamento> alocadasNoDia = (idUsuario != null && idTurma != null)
                ? agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data)
                : Collections.emptyList();

        // 2. Busca TODAS as fichas pertencentes a esta turma através da TurmaFicha
        List<Ficha> todasDaTurma = (idTurma != null)
                ? turmaFichaRepository.findFichasByTurmaId(idTurma)
                : Collections.emptyList();

        // 3. Busca TODOS os agendamentos ativos desta turma em qualquer data
        List<Agendamento> todosAgendamentosDaTurma = (idUsuario != null && idTurma != null)
                ? agendamentoRepository.buscarTodosPorUsuarioETurma(idUsuario, idTurma)
                : Collections.emptyList();

        // 4. Extrai os IDs das fichas que já foram agendadas no calendário
        List<Long> idsAlocadosEmQualquerData = todosAgendamentosDaTurma.stream()
                .filter(a -> a.getFicha() != null)
                .map(a -> a.getFicha().getId())
                .toList();

        // 5. Filtra mantendo apenas as fichas da turma que não estão agendadas na data atual
        List<Ficha> disponiveis = todasDaTurma.stream()
                .filter(ficha -> ficha.getId() != null && !idsAlocadosEmQualquerData.contains(ficha.getId()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadasNoDia);
        response.put("disponiveis", disponiveis);

        return response;
    }

    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) {
        if (idFicha == null || novaData == null) return;

        // Evita agendamentos duplicados na mesma data
        boolean jaExiste = agendamentoRepository.existsByFicha_IdAndDataAndSituacao(idFicha, novaData, "A");
        if (jaExiste) {
            throw new IllegalArgumentException("Esta ficha já se encontra agendada para este dia!");
        }

        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Ficha não encontrada."));

        Agendamento agendamento = new Agendamento();
        agendamento.setFicha(ficha);
        agendamento.setData(novaData);
        agendamento.setSituacao("A");
        agendamento.setConcluido("N");

        agendamentoRepository.save(agendamento);
    }

    @Transactional
    public void desalocarFicha(Long idAgendamento) {
        if (idAgendamento != null) {
            agendamentoRepository.desalocarPorId(idAgendamento);
        }
    }
}