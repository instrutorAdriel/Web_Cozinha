package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import com.application.WebApplicationSIGEC.repository.TurmasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FichasService {

    @Autowired
    private FichasRepository fichasRepository;

    @Autowired
    private TurmasRepository turmasRepository;

    public Fichas buscarReceitas(String nome){
        Optional<Fichas> rs = fichasRepository.findByNome(nome);
        return rs.orElse(null);
    }

    // AJUSTE: Mude o retorno de 'Fichas' para 'List<Fichas>'
    public List<Fichas> buscarData(LocalDate data) {
        List<Fichas> rs = fichasRepository.findByData(data);

        // Verificamos se a lista NÃO está vazia
        if (!rs.isEmpty()) {
            return rs; // Retorna a lista com todas as fichas encontradas
        }

        return java.util.Collections.emptyList(); // Retorna uma lista vazia segura em vez de null
    }

    // função temporaria
    public List<Fichas> buscarTodas() {
        return fichasRepository.findAll();
    }

    @Transactional // <-- Adiciona isto aqui para o Spring gerir o UPDATE de forma segura
    public void alocarFicha(int idFicha, LocalDate novaData, int IdTurma) {
        Fichas ficha = fichasRepository.findById(idFicha).orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        Turmas turma = turmasRepository.findById(IdTurma).orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        ficha.setData(novaData);
        ficha.setTurma(turma);
        fichasRepository.save(ficha);
    }

    @Transactional // <-- Adiciona isto aqui para o Spring gerir o UPDATE de forma segura
    public void desalocarFicha(int idFicha) {
        Fichas ficha = fichasRepository.findById(idFicha).orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        ficha.setData(null);
        ficha.setTurma(null);
        fichasRepository.save(ficha);
    }
}
