package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Integer> {

    // Busca as turmas cruzando a partir do usuário logado
    @Query("SELECT t FROM Usuario u JOIN u.turmas t WHERE u.idUsuario = :idUsuario")
    List<Turma> findTurmasByUsuarioId(@Param("idUsuario") Integer idUsuario);
}