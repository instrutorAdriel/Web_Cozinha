package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.*;
import com.application.WebApplicationSIGEC.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EstruturaService {

    private final UnidadeRepository unidadeRepository;
    private final LaboratorioRepository laboratorioRepository;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaUtensilioRepository categoriaUtensilioRepository;

    public EstruturaService(UnidadeRepository unidadeRepository,
                            LaboratorioRepository laboratorioRepository,
                            CategoriaRepository categoriaRepository,
                            CategoriaUtensilioRepository categoriaUtensilioRepository) {
        this.unidadeRepository = unidadeRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.categoriaRepository = categoriaRepository;
        this.categoriaUtensilioRepository = categoriaUtensilioRepository;
    }

    @Transactional(readOnly = true)
    public List<Unidade> listarUnidadesAtivas() {
        return unidadeRepository.findBySituacao("A");
    }

    @Transactional(readOnly = true)
    public List<Laboratorio> listarLaboratoriosPorUnidade(Integer idUnidade) {
        return laboratorioRepository.findByUnidadeId(idUnidade);
    }

    @Transactional(readOnly = true)
    public List<Categoria> listarCategoriasProdutos() {
        return categoriaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CategoriaUtensilio> listarCategoriasUtensiliosAtivas() {
        return categoriaUtensilioRepository.findBySituacao("A");
    }
}