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

    // Método Spring Data JPA automático para checar se a ficha já possui agendamento na data
    boolean existsByFichaIdFichaAndDataAndSituacao(Integer idFicha, LocalDate data, String situacao);

    // Consulta de agendamentos do dia por Usuário e Turma
    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f ON a.id_ficha = f.id_ficha
        INNER JOIN turma t ON f.id_turma = t.id_turma
        INNER JOIN usuario_turma ut ON t.id_turma = ut.id_turma
        WHERE ut.id_usuario = :idUsuario
          AND (:idTurma IS NULL OR t.id_turma = :idTurma)
          AND a.data = :data
          AND a.situacao = 'A'
        ORDER BY a.data ASC
    """, nativeQuery = true)
    List<Agendamento> buscarAgendamentosPorUsuarioTurmaEData(
            @Param("idUsuario") Integer idUsuario,
            @Param("idTurma") Integer idTurma,
            @Param("data") LocalDate data
    );

    // Busca todos os agendamentos para preencher o grid mensal
    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f ON a.id_ficha = f.id_ficha
        INNER JOIN turma t ON f.id_turma = t.id_turma
        INNER JOIN usuario_turma ut ON t.id_turma = ut.id_turma
        WHERE ut.id_usuario = :idUsuario
          AND (:idTurma IS NULL OR t.id_turma = :idTurma)
          AND a.situacao = 'A'
    """, nativeQuery = true)
    List<Agendamento> buscarTodosPorUsuarioETurma(
            @Param("idUsuario") Integer idUsuario,
            @Param("idTurma") Integer idTurma
    );

    // Deleta o agendamento específico
    @Modifying
    @Query(value = "DELETE FROM agendamento WHERE id_agendamento = :id", nativeQuery = true)
    void desalocarPorId(@Param("id") Integer id);
}