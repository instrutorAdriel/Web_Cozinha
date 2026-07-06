package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Fichas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Fichas, Integer> {

    Optional<Fichas> findByReceita(String receita);

    boolean existsFichasByReceita(String receita);

    Optional<Fichas> findByData(LocalDate data);
}
