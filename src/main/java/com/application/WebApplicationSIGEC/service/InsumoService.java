package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Insumos;
import com.application.WebApplicationSIGEC.repository.InsumosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InsumoService {

    private final InsumosRepository insumosRepository;

    public InsumoService(InsumosRepository insumosRepository) {
        this.insumosRepository = insumosRepository;
    }

    @Transactional(readOnly = true)
    public List<Insumos> listarPorFicha(Integer fichaId) {
        return insumosRepository.findByFichaId(fichaId);
    }

    @Transactional
    public Insumos adicionarInsumo(Insumos insumo) {
        if (insumo.getQuantidade() == null || insumo.getQuantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade do insumo deve ser maior que zero.");
        }
        return insumosRepository.save(insumo);
    }

    @Transactional
    public void cancelarInsumo(Integer idInsumo) {
        Insumos insumo = insumosRepository.findById(idInsumo)
                .orElseThrow(() -> new RuntimeException("Insumo não encontrado com ID: " + idInsumo));
        insumo.setCancelado("S");
        insumosRepository.save(insumo);
    }
}