package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    List<Agendamento> findByIdFicha(Long idFicha);

    // 1. Busca os agendamentos do dia CARREGANDO A FICHA JUNTO (JOIN FETCH)
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN Turma t ON f.idTurma = t.idTurma
        JOIN UsuarioTurma ut ON t.idTurma = ut.idTurma
        WHERE ut.idUsuario = :idUsuario
          AND (:idTurma IS NULL OR t.idTurma = :idTurma)
          AND a.data = :data
    """)
    List<Agendamento> buscarAgendamentosPorUsuarioTurmaEData(
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Integer idTurma,
            @Param("data") LocalDate data
    );

    // 2. Busca todos os agendamentos para desenhar as bolinhas no calendário
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN Turma t ON f.idTurma = t.idTurma
        JOIN UsuarioTurma ut ON t.idTurma = ut.idTurma
        WHERE ut.idUsuario = :idUsuario
          AND (:idTurma IS NULL OR t.idTurma = :idTurma)
    """)
    List<Agendamento> buscarTodosPorUsuarioETurma(
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Integer idTurma
    );

    // 3. Método para deletar agendamento pelo ID
    @Modifying
    @Query(value = "DELETE FROM agendamento WHERE id_agendamento = :id", nativeQuery = true)
    void desalocarPorId(@Param("id") Integer id);
}