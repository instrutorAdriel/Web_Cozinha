package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class FichasService {

    @Autowired
    private FichasRepository fichasRepository;

    @Autowired
    private TurmasRepository turmasRepository;

    @Transactional(readOnly = true)
    public Fichas buscarReceitas(String nome) {
        Optional<Fichas> rs = fichasRepository.findByNome(nome);
        return rs.orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Fichas> buscarData(LocalDate data) {
        List<Fichas> rs = fichasRepository.findByData(data);
        if (!rs.isEmpty()) {
            return rs;
        }
        return Collections.emptyList();
    }

    @Transactional(readOnly = true)
    public List<Fichas> buscarTodas() {
        return fichasRepository.findAll();
    }

    @Transactional
    public void alocarFicha(int idFicha, LocalDate novaData, int idTurma) {
        Fichas ficha = fichasRepository.findByIdWithTurmas(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com o ID: " + idFicha));

        Turmas turma = turmasRepository.findById(idTurma)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com o ID: " + idTurma));

        ficha.setData(novaData);
        ficha.getTurmas().add(turma); // Adiciona com segurança sem fazer Cast manual!

        fichasRepository.save(ficha);
    }

    @Transactional
    public void desalocarFicha(int idFicha, int idTurma) {
        Fichas ficha = fichasRepository.findByIdWithTurmas(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com o ID: " + idFicha));

        // Remove a turma específica associada
        ficha.getTurmas().removeIf(t -> t.getId() == idTurma);

        // Se não restar nenhuma turma vinculada, limpa a data
        if (ficha.getTurmas().isEmpty()) {
            ficha.setData(null);
        }

        fichasRepository.save(ficha);
    }
}