package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Fichas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Fichas, Integer> {

    Optional<Fichas> findByNome(String nome);

    boolean existsFichasByNome(String nome);

    List<Fichas> findByData(LocalDate data);

    List<Fichas> findByDataIsNull();

    // Procure por este método no seu FichasRepository.java e mude para:

    @Query("SELECT f FROM Fichas f JOIN f.turmas t WHERE f.data = :data AND t.id = :turmaId")
    List<Fichas> findByDataAndTurmasId(@Param("data") LocalDate data, @Param("turmaId") int turmaId);

    // CORREÇÃO AQUI: Mudado de TurmaIsNull para TurmasIsNull (Plural)
    List<Fichas> findByDataIsNullAndTurmasIsNull();
}
