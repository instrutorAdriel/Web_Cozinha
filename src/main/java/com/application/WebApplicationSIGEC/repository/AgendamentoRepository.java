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

    // Impede que a mesma ficha seja agendada mais de uma vez na mesma turma (em qualquer dia)
    boolean existsByTurma_IdAndFicha_IdAndSituacao(Long idTurma, Long idFicha, String situacao);

    // 1. Validação de duplicidade: impede agendar a mesma ficha para a mesma turma no mesmo dia
    boolean existsByTurma_IdAndFicha_IdAndDataAndSituacao(Long idTurma, Long idFicha, LocalDate data, String situacao);

    // 2. Todos os agendamentos da turma para montar as marcações (bolinhas) no calendário
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN FETCH a.turma t
        WHERE a.turma.id = :idTurma
          AND a.situacao = 'A'
        ORDER BY a.data ASC
    """)
    List<Agendamento> buscarTodosPorTurma(@Param("idTurma") Long idTurma);

    // 3. Agendamentos de uma data específica na turma (painel lateral do dia)
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN FETCH a.turma t
        WHERE a.turma.id = :idTurma
          AND a.data = :data
          AND a.situacao = 'A'
        ORDER BY f.nomeFicha ASC
    """)
    List<Agendamento> buscarPorTurmaEData(@Param("idTurma") Long idTurma, @Param("data") LocalDate data);

    // 4. Agendamentos da semana para o painel principal (Home) filtrados pelo professor logado
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN FETCH a.turma t
        INNER JOIN UsuarioTurma ut ON ut.turma.id = t.id
        WHERE ut.usuario.id = :idUsuario
          AND a.data BETWEEN :inicio AND :fim
          AND a.situacao = 'A'
        ORDER BY a.data ASC, a.id ASC
    """)
    List<Agendamento> buscarAgendamentosDaSemana(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("idUsuario") Long idUsuario
    );

    // 5. Agendamentos do dia atual para o dashboard da Home
    @Query("""
        SELECT a FROM Agendamento a
        JOIN FETCH a.ficha f
        JOIN FETCH a.turma t
        INNER JOIN UsuarioTurma ut ON ut.turma.id = t.id
        WHERE ut.usuario.id = :idUsuario
          AND a.data = :hoje
          AND a.situacao = 'A'
        ORDER BY a.data ASC
    """)
    List<Agendamento> findAgendamentosDoUsuarioHoje(
            @Param("hoje") LocalDate hoje,
            @Param("idUsuario") Long idUsuario
    );

    // 6. Desalocar / Cancelar aula pelo ID do agendamento
    @Modifying
    @Query("DELETE FROM Agendamento a WHERE a.id = :id")
    void desalocarPorId(@Param("id") Long id);
}