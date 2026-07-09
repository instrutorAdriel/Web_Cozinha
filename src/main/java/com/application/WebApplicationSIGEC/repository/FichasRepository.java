package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Fichas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Fichas, Integer> {

    Optional<Fichas> findByNome(String nome);

    boolean existsFichasByNome(String nome);

    List<Fichas> findByData(LocalDate data);

    List<Fichas> findByDataIsNull();

    List<Fichas> findByDataIsNotNull();
}
