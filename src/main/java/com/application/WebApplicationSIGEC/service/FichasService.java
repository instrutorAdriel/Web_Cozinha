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

    // =========================================================
    // ALOCAR FICHA (COM VALIDAÇÃO CONTRA DUPLICIDADE NO MESMO DIA)
    // =========================================================
    @Transactional
    public void alocarFicha(Integer idFicha, LocalDate novaData) {
        if (idFicha == null || novaData == null) {
            return;
        }

        // 1. Envia "A" como String para bater com a assinatura do Repository
        boolean jaExiste = agendamentoRepository.existsByFichaIdFichaAndDataAndSituacao(idFicha, novaData, "A");
        if (jaExiste) {
            throw new IllegalArgumentException("Esta ficha já está alocada para este dia!");
        }

        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Ficha técnica não encontrada."));

        Agendamento agendamento = new Agendamento();
        agendamento.setFicha(ficha);
        agendamento.setData(novaData);

        // 2. Define como String se a entidade Agendamento usa String para situacao e concluido
        agendamento.setSituacao("A"); // "A" como String
        agendamento.setConcluido("N"); // "N" como String

        agendamentoRepository.save(agendamento);
    }

    // =========================================================
    // BUSCA ALOCADAS E FILTRA DISPONÍVEIS ESPECÍFICOS DA DATA
    // =========================================================
    public Map<String, Object> buscarFichasEDisponiveisDoDia(Integer idUsuario, Integer idTurma, LocalDate data) {
        // 1. Busca fichas agendadas na data selecionada
        List<Agendamento> alocadas = (idUsuario != null && idTurma != null)
                ? agendamentoRepository.buscarAgendamentosPorUsuarioTurmaEData(idUsuario, idTurma, data)
                : Collections.emptyList();

        // 2. Busca todas as fichas associadas à turma
        List<Ficha> todasDaTurma = (idTurma != null)
                ? fichasRepository.findByIdTurma(idTurma)
                : Collections.emptyList();

        // 3. Extrai os IDs das fichas que JÁ possuem agendamento NESTE DIA ESPECÍFICO
        List<Integer> idsAlocadosNoDia = alocadas.stream()
                .filter(a -> a.getFicha() != null)
                .map(a -> a.getFicha().getIdFicha())
                .toList();

        // 4. Filtra o acervo: só exibe como disponível o que NÃO está agendado NESTE DIA
        List<Ficha> disponiveis = todasDaTurma.stream()
                .filter(f -> f.getIdFicha() != null && !idsAlocadosNoDia.contains(f.getIdFicha()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadas);
        response.put("disponiveis", disponiveis);

        return response;
    }

    // Busca todos os agendamentos da turma para desenhar os marcadores no calendário
    public List<Agendamento> buscarTodosAgendamentosDaTurma(Integer idUsuario, Integer idTurma) {
        if (idUsuario == null) {
            return Collections.emptyList();
        }
        return agendamentoRepository.buscarTodosPorUsuarioETurma(idUsuario, idTurma);
    }

    // Desaloca a ficha através do ID do Agendamento
    @Transactional
    public void desalocarFicha(Integer idAgendamento) {
        if (idAgendamento != null) {
            agendamentoRepository.desalocarPorId(idAgendamento);
        }
    }
}