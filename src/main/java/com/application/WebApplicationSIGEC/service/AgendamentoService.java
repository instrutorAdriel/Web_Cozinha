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

    @Transactional(readOnly = true)
    public List<Turmas> buscarTurmasPorUsuarioEmail(String email) {
        return turmasRepository.findByUsuarioEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Agendamento> buscarAgendamentosPorTurmaEData(Integer turmaId, LocalDate data) {
        return agendamentoRepository.findByFichaIdAndData(turmaId, data)
                .map(List::of)
                .orElse(List.of());
    }

    @Transactional(readOnly = true)
    public Map<String, Long> buscarResumoAgendamentosDoMes(int ano, int mes, Integer turmaId) {
        List<Agendamento> agendamentos = agendamentoRepository.findByTurmaIdAndMesEAno(turmaId, mes, ano);

        return agendamentos.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getData().toString(),
                        Collectors.counting()
                ));
    }

    @Transactional
    public void alocarFichaNaTurma(Integer fichaId, LocalDate data) {
        boolean jaAgendado = agendamentoRepository.findByFichaIdAndData(fichaId, data).isPresent();

        if (jaAgendado) {
            throw new IllegalArgumentException("Esta ficha já está agendada para esta data.");
        }

        Fichas ficha = fichasRepository.findById(fichaId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha técnica não encontrada. ID: " + fichaId));

        Agendamento novoAgendamento = new Agendamento();
        novoAgendamento.setFicha(ficha);
        novoAgendamento.setData(data);
        novoAgendamento.setSituacao("A");
        novoAgendamento.setConcluido("N");

        agendamentoRepository.save(novoAgendamento);
    }

    @Transactional
    public void desalocarFicha(Integer fichaId, LocalDate data) {
        agendamentoRepository.deleteByFichaIdAndData(fichaId, data);
    }
}