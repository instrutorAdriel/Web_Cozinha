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

    // Busca agendamentos ativos do dia para as turmas do usuário logado via TurmaFicha (sem filtro de situação em turma_ficha)
    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.ficha f " +
            "WHERE a.data = :data AND a.situacao = 'A' " +
            "AND f.id IN (SELECT tf.ficha.id FROM TurmaFicha tf WHERE tf.turma.id IN (SELECT tu.id FROM Usuario u JOIN u.turmas tu WHERE u.id = :idUsuario)) " +
            "ORDER BY a.data ASC")
    List<Agendamento> findAgendamentosDoUsuarioHoje(@Param("data") LocalDate data, @Param("idUsuario") Long idUsuario);

    // Validação de alocação duplicada mapeando o ID da entidade Ficha
    boolean existsByFicha_IdAndDataAndSituacao(Long idFicha, LocalDate data, String situacao);

    // Agendamentos do dia por Usuário e Turma (INNER JOIN com a tabela intermediária turma_ficha sem filtro de tf.situacao)
    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f ON a.id_ficha = f.id_ficha
        INNER JOIN turma_ficha tf ON f.id_ficha = tf.id_ficha
        INNER JOIN turma t ON tf.id_turma = t.id_turma
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

    // Todos os agendamentos da turma/usuário via turma_ficha
    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f ON a.id_ficha = f.id_ficha
        INNER JOIN turma_ficha tf ON f.id_ficha = tf.id_ficha
        INNER JOIN turma t ON tf.id_turma = t.id_turma
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

    // Busca agendamentos da semana vinculados às turmas do usuário via TurmaFicha
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        WHERE a.data BETWEEN :inicio AND :fim
          AND a.situacao = 'A'
          AND f.id IN (
              SELECT tf.ficha.id
              FROM TurmaFicha tf
              WHERE tf.turma.id IN (
                  SELECT tu.id
                  FROM Usuario u
                  JOIN u.turmas tu
                  WHERE u.id = :idUsuario
              )
          )
        ORDER BY a.data ASC, a.id ASC
    """)
    List<Agendamento> buscarAgendamentosDaSemana(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("idUsuario") Long idUsuario
    );
}