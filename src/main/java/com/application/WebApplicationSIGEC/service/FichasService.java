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

    public List<Agendamento> buscarTodosAgendamentosDaTurma(Long idTurma) {
        if (idTurma == null) return Collections.emptyList();
        return agendamentoRepository.buscarTodosPorTurma(idTurma);
    }

    // =========================================================
    // ACERVO DE RECEITAS (NOVO MÉTODO CORRIGIDO)
    // =========================================================
    public List<?> buscarAcervoReceitasDaTurma(Long idTurma) {
        if (idTurma == null) return Collections.emptyList();

        // 1. Busca todas as fichas vinculadas ao curso desta turma
        List<Ficha> fichasDoCurso = fichasRepository.findFichasAtivasByTurmaId(idTurma);

        // 2. Busca todos os agendamentos desta turma
        List<Agendamento> agendamentosDaTurma = agendamentoRepository.buscarTodosPorTurma(idTurma);

        // Mapa de agendamentos: id_ficha -> data
        Map<Long, LocalDate> fichasAgendadas = new HashMap<>();
        for (Agendamento a : agendamentosDaTurma) {
            if ("A".equals(a.getSituacao()) && a.getFicha() != null) {
                fichasAgendadas.put(a.getFicha().getId(), a.getData());
            }
        }

        // Usando 'var' do JDK 25, o Java permite o acervo.add(map) sem ficar vermelho
        var acervo = new ArrayList<>();

        for (Ficha f : fichasDoCurso) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("nomeFicha", f.getNomeFicha());
            map.put("preparo", f.getPreparo());
            map.put("categoria", f.getCategoria());
            map.put("idTurma", idTurma);

            if (fichasAgendadas.containsKey(f.getId())) {
                map.put("status", "datadas");
                map.put("dataPrevista", fichasAgendadas.get(f.getId()).toString());
            } else {
                map.put("status", "disponivel");
                map.put("dataPrevista", null);
            }
            acervo.add(map);
        }

        return acervo;
    }

    public Map<String, Object> buscarFichasEDisponiveisDoDia(Long idTurma, LocalDate data) {
        if (idTurma == null || data == null) return Collections.emptyMap();

        List<Agendamento> alocadasNoDia = agendamentoRepository.buscarPorTurmaEData(idTurma, data);

        // Usa a mesma query da tela de Receitas: traz SOMENTE as fichas ativas do curso desta turma
        List<Ficha> fichasDoCurso = fichasRepository.findFichasAtivasByTurmaId(idTurma);

        List<Agendamento> todosDaTurma = agendamentoRepository.buscarTodosPorTurma(idTurma);
        Set<Long> idsJaAlocados = new HashSet<>();
        for (Agendamento a : todosDaTurma) {
            if (a.getFicha() != null && a.getFicha().getId() != null) {
                idsJaAlocados.add(a.getFicha().getId());
            }
        }

        List<Ficha> disponiveis = fichasDoCurso.stream()
                .filter(f -> f.getId() != null && !idsJaAlocados.contains(f.getId()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("alocadas", alocadasNoDia);
        response.put("disponiveis", disponiveis);
        return response;
    }

    @Transactional
    public void alocarFicha(Long idFicha, Long idTurma, LocalDate dataAula) {
        if (idFicha == null || idTurma == null || dataAula == null) {
            throw new IllegalArgumentException("Parâmetros obrigatórios ausentes para alocação.");
        }

        boolean jaExiste = agendamentoRepository.existsByTurma_IdAndFicha_IdAndSituacao(
                idTurma, idFicha, "A");
        if (jaExiste) {
            throw new IllegalArgumentException("Esta receita já está agendada para esta turma!");
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

    @Transactional
    public void desalocarFicha(Long idAgendamento) {
        if (idAgendamento != null) {
            agendamentoRepository.desalocarPorId(idAgendamento);
        }
    }
}