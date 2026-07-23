package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    List<Agendamento> findByTurmaIdAndData(Integer turmaId, LocalDate data);

    Optional<Agendamento> findByTurmaIdAndFichaIdAndData(Integer turmaId, Integer fichaId, LocalDate data);

    void deleteByTurmaIdAndFichaIdAndData(Integer turmaId, Integer fichaId, LocalDate data);

    @Query("SELECT a FROM Agendamento a WHERE a.turma.id = :turmaId AND MONTH(a.data) = :mes AND YEAR(a.data) = :ano")
    List<Agendamento> findByTurmaIdAndMesEAno(
            @Param("turmaId") Integer turmaId,
            @Param("mes") int mes,
            @Param("ano") int ano
    );
}