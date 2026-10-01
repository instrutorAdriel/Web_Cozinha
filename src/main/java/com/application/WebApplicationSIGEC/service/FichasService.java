package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FichasService {

    private final FichasRepository fichasRepository;


    public FichasService(FichasRepository fichasRepository) {
        this.fichasRepository = fichasRepository;
    }

    public Ficha buscarReceitas(String nomeFicha) {
        Optional<Ficha> rs = fichasRepository.findByNomeFicha(nomeFicha);
        return rs.orElse(null);
    }

    public List<Ficha> buscarData(LocalDate data) {
        List<Ficha> rs = fichasRepository.findByData(data);

        if (!rs.isEmpty()) {
            return rs;
        }

        return java.util.Collections.emptyList();
    }

    public List<Ficha> buscarTodas() {
        return fichasRepository.findAll();
    }


    public List<Ficha> buscarFichasPorUsuario(Long idUsuario) {
        return fichasRepository.findFichasByUsuarioId(idUsuario);
    }

    // Busca somente as fichas que ainda não foram alocadas
    public List<Ficha> buscarDisponiveis() {
        return fichasRepository.findByDataIsNull();
    }

    // Busca somente as fichas que já foram alocadas no calendário
    public List<Ficha> buscarAlocadas() {
        return fichasRepository.findByDataIsNotNull();
    }

    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) {
        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        ficha.setData(novaData);
        fichasRepository.save(ficha);
    }

    @Transactional
    public void desalocarFicha(Long idFicha) {
        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        ficha.setData(null);
        fichasRepository.save(ficha);
    }
}