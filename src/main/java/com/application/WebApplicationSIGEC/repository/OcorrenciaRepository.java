package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Integer> {
    List<Ocorrencia> findByUtensilioId(Integer idUtensilio);
    List<Ocorrencia> findBySituacao(String situacao);
}