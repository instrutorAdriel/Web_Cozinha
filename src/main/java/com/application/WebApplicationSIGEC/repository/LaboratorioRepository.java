package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Laboratorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaboratorioRepository extends JpaRepository<Laboratorio, Integer> {
    List<Laboratorio> findByUnidadeId(Integer idUnidade);
    List<Laboratorio> findBySituacao(String situacao);
}