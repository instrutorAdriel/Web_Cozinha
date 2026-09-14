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

    List<Agendamento> findByData(LocalDate data);

    Optional<Agendamento> findByFichaIdAndData(Integer fichaId, LocalDate data);

    void deleteByFichaIdAndData(Integer fichaId, LocalDate data);

    @Query("SELECT a FROM Agendamento a JOIN a.ficha f JOIN f.turma t WHERE t.id = :turmaId AND MONTH(a.data) = :mes AND YEAR(a.data) = :ano")
    List<Agendamento> findByTurmaIdAndMesEAno(
            @Param("turmaId") Integer turmaId,
            @Param("mes") int mes,
            @Param("ano") int ano
    );
}