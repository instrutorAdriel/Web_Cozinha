package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Fichas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FichasRepository extends JpaRepository<Fichas, Integer> {

    Optional<Fichas> findByNome(String nome);

    boolean existsFichasByNome(String nome);

    List<Fichas> findByData(LocalDate data);

    List<Fichas> findByDataIsNull();

    @Query("SELECT DISTINCT f FROM Fichas f LEFT JOIN FETCH f.turmas WHERE f.id = :id")
    Optional<Fichas> findByIdWithTurmas(@Param("id") int id);

    @Query("SELECT DISTINCT f FROM Fichas f JOIN f.turmas t WHERE f.data = :data AND t.id = :turmaId")
    List<Fichas> findByDataAndTurmasId(@Param("data") LocalDate data, @Param("turmaId") int turmaId);

    List<Fichas> findByDataIsNullAndTurmasIsNull();
}