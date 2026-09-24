package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.ficha f " +
            "JOIN FETCH f.turma t " +
            "JOIN FETCH t.laboratorio " +
            "WHERE a.data = :data AND a.situacao = 'A' " +
            "ORDER BY a.data ASC")
    List<Agendamento> findAgendamentosDoDia(@Param("data") LocalDate data);
}