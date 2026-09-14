package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnidadeRepository extends JpaRepository<Unidade, Integer> {
    List<Unidade> findBySituacao(String situacao);
}