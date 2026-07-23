package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final TurmasRepository turmasRepository;
    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoService(TurmasRepository turmasRepository,
                              FichasRepository fichasRepository,
                              AgendamentoRepository agendamentoRepository) {
        this.turmasRepository = turmasRepository;
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    // Busca de turmas alterada para consultar pelo E-mail do usuário
    @Transactional(readOnly = true)
    public List<Turmas> buscarTurmasPorUsuarioEmail(String email) {
        return turmasRepository.findByUsuarioEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Agendamento> buscarAgendamentosPorTurmaEData(Integer turmaId, LocalDate data) {
        return agendamentoRepository.findByTurmaIdAndData(turmaId, data);
    }

    public Map<String, Long> buscarResumoAgendamentosDoMes(int ano, int mes, Integer turmaId) {
        // Busca todos os agendamentos daquela turma no mês/ano
        List<Agendamento> agendamentos = agendamentoRepository.findByTurmaIdAndMesEAno(turmaId, mes, ano);

        // Agrupa por data formatada (YYYY-MM-DD) e conta quantas fichas existem em cada dia
        return agendamentos.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getData().toString(), // Chave: "2026-07-22"
                        Collectors.counting()        // Valor: Quantidade de fichas no dia
                ));
    }

    @Transactional
    public void alocarFichaNaTurma(Integer fichaId, Integer turmaId, LocalDate data) {
        boolean jaAgendado = agendamentoRepository
                .findByTurmaIdAndFichaIdAndData(turmaId, fichaId, data)
                .isPresent();

        if (jaAgendado) {
            throw new IllegalArgumentException("Esta ficha já está agendada para esta turma nesta data.");
        }

        Fichas ficha = fichasRepository.findById(fichaId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha técnica não encontrada. ID: " + fichaId));

        Turmas turma = turmasRepository.findById(turmaId)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada. ID: " + turmaId));

        Agendamento novoAgendamento = new Agendamento(turma, ficha, data);
        agendamentoRepository.save(novoAgendamento);
    }

    @Transactional
    public void desalocarFichaNaTurma(Integer fichaId, Integer turmaId, LocalDate data) {
        agendamentoRepository.deleteByTurmaIdAndFichaIdAndData(turmaId, fichaId, data);
    }
}