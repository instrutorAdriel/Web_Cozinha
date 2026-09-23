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

    // Injeção via construtor (resolve o aviso de "Field injection is not recommended")
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

    @Transactional
    public void alocarFicha(Long idFicha, LocalDate novaData) { // Alterado de int para Long
        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        ficha.setData(novaData);
        fichasRepository.save(ficha);
    }

    @Transactional
    public void desalocarFicha(Long idFicha) { // Alterado de int para Long
        Ficha ficha = fichasRepository.findById(idFicha)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        ficha.setData(null);
        fichasRepository.save(ficha);
    }
}