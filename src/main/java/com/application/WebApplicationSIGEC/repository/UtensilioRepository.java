package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Utensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtensilioRepository extends JpaRepository<Utensilio, Long> {

    // Método que vai fazer a pesquisa no banco de dados
    List<Utensilio> findByNomeUtensilioContainingIgnoreCase(String nomeUtensilio);

}