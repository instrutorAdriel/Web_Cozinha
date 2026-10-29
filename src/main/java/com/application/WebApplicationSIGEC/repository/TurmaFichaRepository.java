package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import com.application.WebApplicationSIGEC.model.TurmaFicha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaFichaRepository extends JpaRepository<TurmaFicha, Long> {

    // Busca todos os vínculos de uma turma
    List<TurmaFicha> findByTurmaId(Long idTurma);

    // Busca vínculos de uma turma em uma data específica
    List<TurmaFicha> findByTurmaIdAndData(Long idTurma, LocalDate data);

    // Busca um vínculo específico entre turma, ficha e data
    Optional<TurmaFicha> findByTurmaIdAndFichaIdAndData(Long idTurma, Long idFicha, LocalDate data);

    // Retorna as fichas vinculadas a uma determinada turma
    @Query("SELECT tf.ficha FROM TurmaFicha tf WHERE tf.turma.id = :idTurma")
    List<Ficha> findFichasByTurmaId(@Param("idTurma") Long idTurma);
}