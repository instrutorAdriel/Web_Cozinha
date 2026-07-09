package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.AulasDTO;
import com.application.WebApplicationSIGEC.model.Aulas;
import com.application.WebApplicationSIGEC.repository.AulasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AulaService {

    @Autowired
    private AulasRepository aulaRepository;

    public List<AulasDTO> buscarAulasPorData(LocalDate data) {
        // 1. Busca as entidades originais do banco de dados
        List<Aulas> aulasDoBanco = aulaRepository.findByData(data);

        // Formatador para garantir que a hora vire String "HH:mm" caso use LocalTime no banco
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // 2. Converte a lista de Entidades para a lista de DTOs
        // Dentro do seu método buscarAulasPorData...
        return aulasDoBanco.stream().map(aulas -> {
            AulasDTO dto = new AulasDTO();

            // Agora é direto! Não precisa de .toString() nem de buscar outra entidade
            dto.setStatus(aulas.getStatus());
            dto.setNomeDisciplina(aulas.getNomeDisciplina());

            dto.setCodigoReceita(String.valueOf(aulas.getFicha().getId()));
            dto.setTurma(aulas.getTurma());
            dto.setHorarioInicio(aulas.getHorarioInicio().format(timeFormatter));
            dto.setHorarioFim(aulas.getHorarioFim().format(timeFormatter));
            dto.setSalaCozinha(aulas.getLaboratorioOuSala());

            return dto;
        }).collect(Collectors.toList());
    }
}