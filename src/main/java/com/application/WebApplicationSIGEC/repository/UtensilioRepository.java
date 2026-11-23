package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Utensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtensilioRepository extends JpaRepository<Utensilio, Long> {

    Optional<Utensilio> findFirstByNomeUtensilioIgnoreCase(String nomeUtensilio);

    // Método que vai fazer a pesquisa no banco de dados
    List<Utensilio> findByNomeUtensilioContainingIgnoreCase(String nomeUtensilio);

}