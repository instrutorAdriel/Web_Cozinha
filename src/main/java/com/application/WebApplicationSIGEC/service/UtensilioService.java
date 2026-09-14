package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Utensilios;
import com.application.WebApplicationSIGEC.repository.UtensiliosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UtensilioService {

    private final UtensiliosRepository utensiliosRepository;

    public UtensilioService(UtensiliosRepository utensiliosRepository) {
        this.utensiliosRepository = utensiliosRepository;
    }

    @Transactional(readOnly = true)
    public List<Utensilios> listarTodosAtivos() {
        return utensiliosRepository.findBySituacao("A");
    }

    @Transactional(readOnly = true)
    public Utensilios buscarPorPatrimonio(Integer numeroPatrimonio) {
        return utensiliosRepository.findByNumeroPatrimonio(numeroPatrimonio)
                .orElseThrow(() -> new RuntimeException("Utensílio não encontrado com o patrimônio: " + numeroPatrimonio));
    }

    @Transactional
    public Utensilios salvar(Utensilios utensilio) {
        return utensiliosRepository.save(utensilio);
    }

    @Transactional
    public void desativar(Integer idUtensilio) {
        Utensilios utensilio = utensiliosRepository.findById(idUtensilio)
                .orElseThrow(() -> new RuntimeException("Utensílio não encontrado com ID: " + idUtensilio));
        utensilio.setSituacao("I");
        utensiliosRepository.save(utensilio);
    }
}