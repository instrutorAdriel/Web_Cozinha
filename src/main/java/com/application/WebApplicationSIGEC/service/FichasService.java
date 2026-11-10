package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.model.Turma;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.CursoFichaRepository;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final CursoFichaRepository cursoFichaRepository;
    private final TurmaRepository turmaRepository;

    public FichasService(FichasRepository fichasRepository,
                         AgendamentoRepository agendamentoRepository,
                         CursoFichaRepository cursoFichaRepository,
                         TurmaRepository turmaRepository) {
        this.fichasRepository = fichasRepository;
        this.agendamentoRepository = agendamentoRepository;
        this.cursoFichaRepository = cursoFichaRepository;
        this.turmaRepository = turmaRepository;
    }

    public Ficha buscarReceitas(String nomeFicha) {
        return fichasRepository.findByNomeFicha(nomeFicha).orElse(null);
    }

    public List<Ficha> buscarTodas() {
        return fichasRepository.findAll();
    }

    public List<Ficha> buscarFichasPorUsuario(Long idUsuario) {
        if (idUsuario == null) return Collections.emptyList();
        return fichasRepository.findFichasByUsuarioId(idUsuario);
    }

    // =========================================================
    // CALENDÁRIO E AGENDAMENTO
    // =========================================================

    /**
     * Retorna todos os agendamentos da turma para desenhar as marcações do mês.
     */
    public List<Agendamento> buscarTodosAgendamentosDaTurma(Long idTurma) {
        if (idTurma == null) return Collections.emptyList();
        return agendamentoRepository.buscarTodosPorTurma(idTurma);
    }

    /**
     * Monta o painel lateral do dia no Calendário:
     * - 'alocadas': Aulas agendadas especificamente nesta data para a turma.
     * - 'disponiveis': Receitas do CURSO da turma que ainda NÃO foram agendadas em dia algum para ela.
     */
    public Map<String, Object> buscarFichasEDisponiveisDoDia(Long idTurma, LocalDate data) {
        if (idTurma == null || data == null) return Collections.emptyMap();

        // 1. Aulas marcadas no dia selecionado
        List<Agendamento> alocadasNoDia = agendamentoRepository.buscarPorTurmaEData(idTurma, data);

        // 2. Todas as fichas da grade do curso pertencente à turma
        List<Ficha> fichasDoCurso = cursoFichaRepository.findFichasByTurmaCurso(idTurma);

        // Se o curso ainda não tiver grade cadastrada, busca o catálogo geral como contingência
        if (fichasDoCurso.isEmpty()) {
            fichasDoCurso = fichasRepository.findAll();
        }

        // 3. Fichas que já foram agendadas em qualquer dia para essa turma
        List<Agendamento> todosDaTurma = agendamentoRepository.buscarTodosPorTurma(idTurma);
        Set<Long> idsJaAlocados = new HashSet<>();
        for (Agendamento a : todosDaTurma) {
            if (a.getFicha() != null && a.getFicha().getId() != null) {
                idsJaAlocados.add(a.getFicha().getId());
            }
        }

        // 4. Disponíveis: fichas da grade do curso que ainda estão livres para agendamento
        List<Ficha> disponiveis = fichasDoCurso.stream()
                .filter(f -> f.getId() != null && !idsJaAlocados.contains(f.getId()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadasNoDia);
        response.put("disponiveis", disponiveis);
        return response;
    }

    /**
     * Aloca uma ficha diretamente para a turma na data informada.
     */
    @Transactional
    public void alocarFicha(Long idFicha, Long idTurma, LocalDate dataAula) {
        if (idFicha == null || idTurma == null || dataAula == null) {
            throw new IllegalArgumentException("Parâmetros obrigatórios ausentes para alocação.");
        }

        // Evita duplicidade no mesmo dia para a mesma turma
        boolean jaExiste = agendamentoRepository.existsByTurma_IdAndFicha_IdAndDataAndSituacao(
                idTurma, idFicha, dataAula, "A");
        if (jaExiste) {
            throw new IllegalArgumentException("Esta receita já está agendada para esta turma nesta data!");
        }

        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Ficha não encontrada: " + idFicha));

        Turma turma = turmaRepository.findById(idTurma)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada: " + idTurma));

        Agendamento agendamento = new Agendamento();
        agendamento.setTurma(turma);
        agendamento.setFicha(ficha);
        agendamento.setData(dataAula);
        agendamento.setSituacao("A");
        agendamento.setConcluido("N");

        agendamentoRepository.save(agendamento);
    }

    /**
     * Cancela/desaloca a aula pelo ID do agendamento.
     */
    @Transactional
    public void desalocarFicha(Long idAgendamento) {
        if (idAgendamento != null) {
            agendamentoRepository.desalocarPorId(idAgendamento);
        }
    }
}