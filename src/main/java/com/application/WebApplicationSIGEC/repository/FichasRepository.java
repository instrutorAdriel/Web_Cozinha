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

    @Query(value = "SELECT * FROM ficha WHERE id_turma = :idTurma", nativeQuery = true)
    List<Ficha> findByIdTurma(@Param("idTurma") Long idTurma);

    // Busca somente as receitas vinculadas à turma selecionada
    //@Query("SELECT f FROM Ficha f JOIN f.turma t WHERE t.id = :idTurma")
    //List<Ficha> findFichasByTurmaId(@Param("idTurma") Long idTurma);

    @Query(value = "SELECT f.* FROM ficha f " +
            "JOIN turma_ficha tf ON tf.id_ficha = f.id_ficha " +
            "WHERE tf.id_turma = :idTurma AND f.situacao = 'A'",
            nativeQuery = true)
    List<Ficha> findFichasByTurmaId(@Param("idTurma") Long idTurma);
}
