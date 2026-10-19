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
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.ficha f " +
            "JOIN FETCH f.turma t " +
            "WHERE a.data = :data AND a.situacao = 'A' " +
            "AND t.id IN (SELECT tu.id FROM Usuario u JOIN u.turmas tu WHERE u.id = :idUsuario) " +
            "ORDER BY a.data ASC")
    List<Agendamento> findAgendamentosDoUsuarioHoje(@Param("data") LocalDate data, @Param("idUsuario") Long idUsuario);


    // 1. Validação de alocação duplicada mapeando o ID da entidade Ficha
    boolean existsByFicha_IdAndDataAndSituacao(Long idFicha, LocalDate data, String situacao);

    // Agendamentos do dia por Usuário e Turma
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
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Long idTurma,
            @Param("data") LocalDate data
    );

    // Todos os agendamentos da turma/usuário
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
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Long idTurma
    );

    // Deleta a alocação pelo ID único do agendamento
    @Modifying
    @Query(value = "DELETE FROM agendamento WHERE id_agendamento = :id", nativeQuery = true)
    void desalocarPorId(@Param("id") Long id);


    // Busca agendamentos de um período vinculados ao usuário
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN FETCH f.turma t
        WHERE a.data BETWEEN :inicio AND :fim
          AND a.situacao = 'A'
          AND t.id IN (
              SELECT tu.id
              FROM Usuario u
              JOIN u.turmas tu
              WHERE u.id = :idUsuario
          )
        ORDER BY a.data ASC, a.id ASC
    """)
    List<Agendamento> buscarAgendamentosDaSemana(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("idUsuario") Long idUsuario
    );


}
