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

    // Consulta JPQL: busca fichas vinculadas às turmas do usuário logado através da TurmaFicha (sem filtro de situação em turma_ficha)
    @Query("SELECT DISTINCT tf.ficha FROM TurmaFicha tf WHERE tf.turma.id IN (SELECT tu.id FROM Usuario u JOIN u.turmas tu WHERE u.id = :idUsuario)")
    List<Ficha> findFichasByUsuarioId(@Param("idUsuario") Long idUsuario);

    // Consulta SQL Nativa: realiza INNER JOIN com a tabela intermediária turma_ficha
    @Query(value = "SELECT f.* FROM ficha f INNER JOIN turma_ficha tf ON f.id_ficha = tf.id_ficha WHERE tf.id_turma = :idTurma", nativeQuery = true)
    List<Ficha> findByIdTurma(@Param("idTurma") Long idTurma);

    // Consulta JPQL: busca receitas vinculadas à turma selecionada
    @Query("SELECT tf.ficha FROM TurmaFicha tf WHERE tf.turma.id = :idTurma")
    List<Ficha> findFichasByTurmaId(@Param("idTurma") Long idTurma);
}
