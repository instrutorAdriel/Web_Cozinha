package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Agendamento;
import com.application.WebApplicationSIGEC.model.ChecklistUtensilio;
import com.application.WebApplicationSIGEC.model.Insumo;
import com.application.WebApplicationSIGEC.repository.AgendamentoRepository;
import com.application.WebApplicationSIGEC.repository.ChecklistUtensilioRepository;
import com.application.WebApplicationSIGEC.repository.InsumoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final AgendamentoRepository agendamentoRepository;
    private final InsumoRepository insumoRepository;
    private final ChecklistUtensilioRepository checklistUtensilioRepository;

    public HomeService(AgendamentoRepository agendamentoRepository,
                       InsumoRepository insumoRepository,
                       ChecklistUtensilioRepository checklistUtensilioRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.insumoRepository = insumoRepository;
        this.checklistUtensilioRepository = checklistUtensilioRepository;
    }

    // Busca as aulas agendadas para a data informada
    public List<Agendamento> buscarAulasDoDia(LocalDate data) {
        return agendamentoRepository.findAgendamentosDoDia(data);
    }

    // Busca insumos e utensílios referentes a uma ficha técnica
    public Map<String, Object> buscarDetalhesDaReceita(Long fichaId) {
        Map<String, Object> detalhes = new HashMap<>();

        List<Insumo> insumos = insumoRepository.findByFichaId(fichaId);
        List<ChecklistUtensilio> utensilios = checklistUtensilioRepository.findByFichaId(fichaId);

        detalhes.put("insumos", insumos);
        detalhes.put("utensilios", utensilios);

        return detalhes;
    }
}