package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<Ficha, Long> {

    @Query("SELECT f FROM Ficha f WHERE f.idTurma = :idTurma")
    List<Ficha> buscarPorTurma(@Param("idTurma") Integer idTurma);
    // Busca todas as fichas associadas diretamente ao ID da turma
    List<Ficha> findByIdTurma(Integer idTurma);

    Optional<Ficha> findByNomeFicha(String nomeFicha);

    boolean existsByNomeFicha(String nomeFicha);

    List<Ficha> findByData(LocalDate data);

    List<Ficha> findByDataIsNull();

    List<Ficha> findByDataIsNotNull();


}
