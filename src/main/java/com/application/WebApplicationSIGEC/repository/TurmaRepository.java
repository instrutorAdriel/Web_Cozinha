package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Integer> {

    @Query(value = """
        SELECT t.* FROM turma t
        INNER JOIN usuario_turma ut ON t.id_turma = ut.id_turma
        WHERE ut.id_usuario = :idUsuario
    """, nativeQuery = true)
    List<Turma> buscarTurmasPorUsuario(@Param("idUsuario") Long idUsuario);
}