package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.CursoFicha;
import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CursoFichaRepository extends JpaRepository<CursoFicha, Long> {

    // Busca se uma receita já está vinculada na matriz do curso
    Optional<CursoFicha> findByCurso_IdAndFicha_Id(Long idCurso, Long idFicha);

    // Retorna todas as receitas vinculadas ao curso da turma informada
    @Query("""
        SELECT cf.ficha FROM CursoFicha cf
        INNER JOIN Turma t ON t.curso.id = cf.curso.id
        WHERE t.id = :idTurma
          AND cf.ficha.situacao = 'A'
        ORDER BY cf.ficha.nomeFicha ASC
    """)
    List<Ficha> findFichasByTurmaCurso(@Param("idTurma") Long idTurma);

    // Retorna todas as receitas diretamente pelo ID do curso
    @Query("""
        SELECT cf.ficha FROM CursoFicha cf
        WHERE cf.curso.id = :idCurso
          AND cf.ficha.situacao = 'A'
        ORDER BY cf.ficha.nomeFicha ASC
    """)
    List<Ficha> findFichasByCursoId(@Param("idCurso") Long idCurso);
}