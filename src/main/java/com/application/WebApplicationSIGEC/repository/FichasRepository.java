package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Fichas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FichasRepository extends JpaRepository<Fichas, Integer> {

    Optional<Fichas> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Fichas> findByTurmaId(Integer turmaId);

    List<Fichas> findBySituacao(String situacao);

    @Query("SELECT f FROM Fichas f JOIN f.turma t WHERE t.id = :turmaId AND f.situacao = 'A'")
    List<Fichas> findAtivasByTurmaId(@Param("turmaId") Integer turmaId);
}