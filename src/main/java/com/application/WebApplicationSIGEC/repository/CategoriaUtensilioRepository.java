package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.CategoriaUtensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaUtensilioRepository extends JpaRepository<CategoriaUtensilio, Integer> {
    List<CategoriaUtensilio> findBySituacao(String situacao);
}
