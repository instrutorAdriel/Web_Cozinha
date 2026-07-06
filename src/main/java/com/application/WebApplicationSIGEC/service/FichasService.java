package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.repository.FichasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class FichasService {

    @Autowired
    private FichasRepository fichasRepository;

    public Fichas buscarReceitas(String receitas){
        Optional<Fichas> rs = fichasRepository.findByReceita(receitas);
        return rs.orElse(null);
    }

    public Fichas buscarData(LocalDate data){
        Optional<Fichas> rs = fichasRepository.findByData(data);
        return rs.orElse(null);
    }
}
