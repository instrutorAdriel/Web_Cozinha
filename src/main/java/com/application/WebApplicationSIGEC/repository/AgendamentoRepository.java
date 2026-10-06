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

    List<Agendamento> findByIdFicha(Integer idFicha);

    // Busca agendamentos vinculados às fichas de uma turma específica e usuário específico
    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f ON a.id_ficha = f.id_ficha
        INNER JOIN turma t ON f.id_turma = t.id_turma
        INNER JOIN usuario_turma ut ON t.id_turma = ut.id_turma
        WHERE ut.id_usuario = :idUsuario
          AND (:idTurma IS NULL OR t.id_turma = :idTurma)
          AND a.data = :data
    """, nativeQuery = true)
    List<Agendamento> buscarAgendamentosPorUsuarioTurmaEData(
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Integer idTurma,
            @Param("data") LocalDate data
    );

    @Query(value = """
        SELECT a.* FROM agendamento a
        INNER JOIN ficha f          ON a.id_ficha = f.id_ficha
        INNER JOIN turma t          ON f.id_turma = t.id_turma
        INNER JOIN usuario_turma ut ON t.id_turma = ut.id_turma
        WHERE ut.id_usuario = :idUsuario
          AND (:idTurma IS NULL OR t.id_turma = :idTurma)
    """, nativeQuery = true)
    List<Agendamento> buscarTodosPorUsuarioETurma(
            @Param("idUsuario") Long idUsuario,
            @Param("idTurma") Integer idTurma
    );

    // 2. Método de desalocar por ID de agendamento ou por ID de ficha
    void deleteByIdAgendamento(Integer idAgendamento);

    @Modifying
    @Query(value = "DELETE FROM agendamento WHERE id_agendamento = :id", nativeQuery = true)
    void desalocarPorId(@Param("id") Integer id);
}