package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FichasRepository extends JpaRepository<Ficha, Long> {

    Optional<Ficha> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Ficha> findByData(LocalDate data);

    List<Ficha> findByDataIsNull();

    List<Ficha> findByDataIsNotNull();

    // Retorna todas as receitas ativas acessíveis por meio dos cursos das turmas do usuário
    @Query("""
        SELECT DISTINCT cf.ficha FROM CursoFicha cf
        INNER JOIN Turma t ON t.curso.id = cf.curso.id
        INNER JOIN UsuarioTurma ut ON ut.turma.id = t.id
        WHERE ut.usuario.id = :idUsuario
          AND cf.ficha.situacao = 'A'
        ORDER BY cf.ficha.nomeFicha ASC
    """)
    List<Ficha> findFichasByUsuarioId(@Param("idUsuario") Long idUsuario);
}