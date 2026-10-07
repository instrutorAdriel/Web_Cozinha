package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.ficha f " +
            "JOIN FETCH f.turma t " +
            "WHERE a.data = :data AND a.situacao = 'A' " +
            "AND t.idTurma IN (SELECT tu.idTurma FROM Usuario u JOIN u.turmas tu WHERE u.idUsuario = :idUsuario) " +
            "ORDER BY a.data ASC")
    List<Agendamento> findAgendamentosDoUsuarioHoje(@Param("data") LocalDate data, @Param("idUsuario") Integer idUsuario);

}