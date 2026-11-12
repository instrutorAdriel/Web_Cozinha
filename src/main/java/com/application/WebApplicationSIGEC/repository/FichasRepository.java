package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Ficha, Long> {

    Optional<Ficha> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Ficha> findByData(LocalDate data);

    List<Ficha> findByDataIsNull();

    List<Ficha> findByDataIsNotNull();

    @Query("SELECT DISTINCT f FROM Ficha f LEFT JOIN f.turmas tf LEFT JOIN f.turma t " +
            "WHERE f.situacao = 'A' AND (" +
            "tf.id IN (SELECT tu.id FROM Usuario u JOIN u.turmas tu WHERE u.id = :idUsuario) " +
            "OR t.id IN (SELECT tu2.id FROM Usuario u2 JOIN u2.turmas tu2 WHERE u2.id = :idUsuario))")
    List<Ficha> findFichasByUsuarioId(@Param("idUsuario") Long idUsuario);

    // Busca somente as receitas do usuário logado via coluna direta id_turma
    @Query(value = "SELECT DISTINCT f.* FROM ficha f " +
            "JOIN usuario_turma ut ON ut.id_turma = f.id_turma " +
            "WHERE ut.id_usuario = :idUsuario AND f.situacao = 'A'",
            nativeQuery = true)
    List<Ficha> findFichasByUsuarioIdNative(@Param("idUsuario") Long idUsuario);

    @Query(value = "SELECT * FROM ficha WHERE id_turma = :idTurma AND situacao = 'A'", nativeQuery = true)
    List<Ficha> findByIdTurma(@Param("idTurma") Long idTurma);

    // Busca somente as receitas vinculadas à turma selecionada via coluna direta id_turma
    @Query(value = "SELECT * FROM ficha WHERE id_turma = :idTurma AND situacao = 'A'", nativeQuery = true)
    List<Ficha> findFichasByTurmaId(@Param("idTurma") Long idTurma);

    // Busca somente as receitas vinculadas à turma selecionada que pertençam ao usuário logado via coluna direta id_turma
    @Query(value = "SELECT DISTINCT f.* FROM ficha f " +
            "JOIN usuario_turma ut ON ut.id_turma = f.id_turma " +
            "WHERE ut.id_usuario = :idUsuario " +
            "  AND f.id_turma = :idTurma " +
            "  AND f.situacao = 'A'",
            nativeQuery = true)
    List<Ficha> findFichasByTurmaIdEUsuarioId(@Param("idTurma") Long idTurma, @Param("idUsuario") Long idUsuario);
}
