package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Ficha, Integer> {

    @Query("SELECT f FROM Ficha f WHERE f.idFicha = :idTurma")
    List<Ficha> buscarPorTurma(@Param("idTurma") Integer idTurma);

    @Query("SELECT f FROM Ficha f WHERE f.turma.idTurma = :idTurma")
    List<Ficha> findByIdTurma(@Param("idTurma") Integer idTurma);

    Optional<Ficha> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Ficha> findByData(LocalDate data);

    List<Ficha> findByDataIsNull();

    List<Ficha> findByDataIsNotNull();


}
