package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;

    public FichasService(FichasRepository fichasRepository, AgendamentoRepository agendamentoRepository) {
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    // =========================================================
    // MÉTODO SOLICITADO: Busca todos os agendamentos da turma/usuário
    // =========================================================
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

    // Busca todas as fichas associadas a uma turma para preencher o acervo/disponíveis
    public List<Ficha> buscarFichasPorTurma(Integer idTurma) {
        if (idTurma == null) {
            return Collections.emptyList();
        }
        return fichasRepository.findByIdTurma(idTurma);
    }

    // Aloca uma ficha (cria novo registro na tabela agendamento)
    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) {
        Agendamento agendamento = new Agendamento();
        agendamento.setIdFicha(idFicha.intValue());
        agendamento.setData(novaData);
        agendamento.setSituacao('A');
        agendamento.setConcluido('N');
        agendamentoRepository.save(agendamento);
    }

    // Desaloca uma ficha
    @Transactional
    public void desalocarFicha(Long idFicha) {
        List<Agendamento> agendamentos = agendamentoRepository.findByIdFicha(idFicha.intValue());
        if (!agendamentos.isEmpty()) {
            agendamentoRepository.deleteAll(agendamentos);
        }
    }
}