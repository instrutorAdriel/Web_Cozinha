package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TurmasService {

    @Autowired
    private TurmasRepository turmasRepository;

    /**
     * Procura todas as turmas vinculadas a um utilizador/instrutor específico.
     * Ideal para preencher o select/checkbox no Frontend do SIGEC.
     */
    @Transactional(readOnly = true)
    public List<Turmas> listarTurmasPorUsuario(int usuarioId) {
        // Validação simples antes de ir ao banco (regra de negócio)
        if (usuarioId <= 0) {
            throw new IllegalArgumentException("ID de utilizador inválido!");
        }
        return turmasRepository.findByUsuarioId(usuarioId);
    }
}