package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Utensilios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtensiliosRepository extends JpaRepository<Utensilios, Integer> {
    Optional<Utensilios> findByNumeroPatrimonio(Integer numeroPatrimonio);
    List<Utensilios> findByCategoriaUtensilioId(Integer idCategoria);
    List<Utensilios> findBySituacao(String situacao);
}