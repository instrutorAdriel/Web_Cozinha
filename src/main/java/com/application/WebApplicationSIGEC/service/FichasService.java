package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;

    public FichasService(FichasRepository fichasRepository, AgendamentoRepository agendamentoRepository) {
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) {
        if (idFicha == null || novaData == null) {
            return;
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setIdFicha(idFicha); // Direto como Long, sem intValue()
        agendamento.setData(novaData);
        agendamento.setSituacao('A'); // Ativo / Agendado
        agendamento.setConcluido('N'); // Não concluído

        agendamentoRepository.save(agendamento);
    }

    // Busca todos os agendamentos da turma/usuário para desenhar as bolinhas na grid do calendário
    public List<Agendamento> buscarTodosAgendamentosDaTurma(Long idUsuario, Integer idTurma) {
        if (idUsuario == null) {
            return Collections.emptyList();
        }
        return agendamentoRepository.buscarTodosPorUsuarioETurma(idUsuario, idTurma);
    }

    // Busca agendamentos de uma data específica
    public List<Agendamento> buscarAgendamentosDoDia(Long idUsuario, Integer idTurma, LocalDate data) {
        if (idUsuario == null || idTurma == null) {
            return Collections.emptyList();
        }
        return agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data);
    }

    // =========================================================
    // BUSCA ALOCADAS DO DIA E FILTRA DISPONÍVEIS GLOBAIS
    // =========================================================
    public Map<String, Object> buscarFichasEDisponiveisDoDia(Long idUsuario, Integer idTurma, LocalDate data) {
        // 1. Fichas alocadas ESPECIFICAMENTE na data selecionada (para exibir no painel de alocadas do dia)
        List<Agendamento> alocadas = (idUsuario != null && idTurma != null)
                ? agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data)
                : Collections.emptyList();

        // 2. Fichas cadastradas na turma
        List<Ficha> todasDaTurma = (idTurma != null)
                ? fichasRepository.findByIdTurma(idTurma)
                : Collections.emptyList();

        // 3. Busca TODOS os agendamentos da turma (de QUALQUER data) para saber quais fichas já estão ocupadas
        List<Agendamento> todosAgendamentosDaTurma = (idUsuario != null)
                ? agendamentoRepository.buscarTodosPorUsuarioETurma(idUsuario, idTurma)
                : Collections.emptyList();

        // 4. Extrai os IDs de TODAS as fichas que já possuem algum agendamento no sistema
        List<Long> idsOcupadosGlobalmente = todosAgendamentosDaTurma.stream()
                .map(Agendamento::getIdFicha)
                .distinct()
                .toList();

        // 5. Remove dos disponíveis QUALQUER ficha que já esteja agendada em qualquer dia
        List<Ficha> disponiveis = todasDaTurma.stream()
                .filter(ficha -> !idsOcupadosGlobalmente.contains(ficha.getIdFicha()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadas);
        response.put("disponiveis", disponiveis);

        return response;
    }

    // Busca todas as fichas associadas a uma turma para preencher o acervo/disponíveis
    public List<Ficha> buscarFichasPorTurma(Integer idTurma) {
        if (idTurma == null) {
            return Collections.emptyList();
        }
        return fichasRepository.findByIdTurma(idTurma);
    }

    @Transactional
    public void desalocarFicha(Long id) {
        if (id != null) {
            // Deleta o registro pelo ID do agendamento
            agendamentoRepository.desalocarPorId(id.intValue());
        }
    }
}