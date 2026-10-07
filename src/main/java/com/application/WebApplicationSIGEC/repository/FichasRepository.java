package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Ficha, Integer> {

    Optional<Ficha> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Ficha> findByData(LocalDate data);

    List<Ficha> findByDataIsNull();

    List<Ficha> findByDataIsNotNull();

    @Query("SELECT f FROM Ficha f JOIN f.turma t WHERE t.idTurma IN (SELECT tu.idTurma FROM Usuario u JOIN u.turmas tu WHERE u.idUsuario = :idUsuario)")
    List<Ficha> findFichasByUsuarioId(@Param("idUsuario") Integer idUsuario);
}
