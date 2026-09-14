package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Ocorrencia;
import com.application.WebApplicationSIGEC.repository.OcorrenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
    }

    @Transactional(readOnly = true)
    public List<Ocorrencia> listarPorUtensilio(Integer idUtensilio) {
        return ocorrenciaRepository.findByUtensilioId(idUtensilio);
    }

    @Transactional
    public Ocorrencia registrarOcorrencia(Ocorrencia ocorrencia) {
        ocorrencia.setDataHora(LocalDateTime.now());
        ocorrencia.setSituacao("A");
        return ocorrenciaRepository.save(ocorrencia);
    }
}