package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;


    public FichasService(FichasRepository fichasRepository, AgendamentoRepository agendamentoRepository) {
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public Ficha buscarReceitas(String nomeFicha) {
        Optional<Ficha> rs = fichasRepository.findByNomeFicha(nomeFicha);
        return rs.orElse(null);
    }

    public List<Ficha> buscarData(LocalDate data) {
        List<Ficha> rs = fichasRepository.findByData(data);

        if (!rs.isEmpty()) {
            return rs;
        }

        return java.util.Collections.emptyList();
    }

    public List<Ficha> buscarTodas() {
        return fichasRepository.findAll();
    }


    public List<Ficha> buscarFichasPorUsuario(Long idUsuario) {
        return fichasRepository.findFichasByUsuarioId(idUsuario);
    }

    // Busca somente as fichas que ainda não foram alocadas
    public List<Ficha> buscarDisponiveis() {
        return fichasRepository.findByDataIsNull();
    }

    // Busca somente as fichas que já foram alocadas no calendário
    public List<Ficha> buscarAlocadas() {
        return fichasRepository.findByDataIsNotNull();
    }
    // =========================================================
    // MÉTODOS DO CALENDÁRIO / AGENDAMENTO (COM TIPO LONG)
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
        List<Agendamento> alocadas = (idUsuario != null && idTurma != null)
                ? agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data)
                : Collections.emptyList();

        List<Ficha> todasDaTurma = (idTurma != null)
                ? fichasRepository.findByIdTurma(idTurma)
                : Collections.emptyList();

        List<Long> idsAlocados = alocadas.stream()
                .filter(a -> a.getFicha() != null)
                .map(a -> a.getFicha().getId())
                .toList();

        List<Ficha> disponiveis = todasDaTurma.stream()
                .filter(f -> f.getId() != null && !idsAlocados.contains(f.getId()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadas);
        response.put("disponiveis", disponiveis);

        return response;
    }

    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) {
        if (idFicha == null || novaData == null) return;

        boolean jaExiste = agendamentoRepository.existsByFicha_IdAndDataAndSituacao(idFicha, novaData, "A");
        if (jaExiste) {
            throw new IllegalArgumentException("Esta ficha já está alocada para este dia!");
        }

        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Ficha técnica não encontrada."));

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