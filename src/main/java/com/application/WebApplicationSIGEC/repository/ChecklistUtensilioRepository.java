package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.ChecklistUtensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistUtensilioRepository extends JpaRepository<ChecklistUtensilio, Integer> {
    List<ChecklistUtensilio> findByFichaId(Integer idFicha);
    List<ChecklistUtensilio> findByUtensilioId(Integer idUtensilio);
    List<ChecklistUtensilio> findBySituacao(String situacao);
}