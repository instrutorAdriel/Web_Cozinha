package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;
    private final TurmasRepository turmasRepository;

    public FichasService(FichasRepository fichasRepository, TurmasRepository turmasRepository) {
        this.fichasRepository = fichasRepository;
        this.turmasRepository = turmasRepository;
    }

    @Transactional(readOnly = true)
    public Fichas buscarPorNome(String nomeFicha) {
        return fichasRepository.findByNomeFicha(nomeFicha).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Fichas> buscarTodas() {
        return fichasRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Fichas> buscarPorTurma(Integer idTurma) {
        return fichasRepository.findByTurmaId(idTurma);
    }

    @Transactional
    public Fichas salvar(Fichas ficha, Integer idTurma) {
        Turmas turma = turmasRepository.findById(idTurma)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com o ID: " + idTurma));

        ficha.setTurma(turma);
        return fichasRepository.save(ficha);
    }

    @Transactional
    public void desativar(Integer idFicha) {
        Fichas ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Ficha técnica não encontrada com ID: " + idFicha));
        ficha.setSituacao("I");
        fichasRepository.save(ficha);
    }
}