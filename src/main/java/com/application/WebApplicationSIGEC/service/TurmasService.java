package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TurmasService {

    private final TurmasRepository turmasRepository;

    public TurmasService(TurmasRepository turmasRepository) {
        this.turmasRepository = turmasRepository;
    }

    @Transactional(readOnly = true)
    public List<Turmas> listarTurmasPorUsuario(Integer usuarioId) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuário inválido!");
        }
        return turmasRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Turmas> listarTodasAtivas() {
        return turmasRepository.findBySituacao("A");
    }
}