package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmasRepository extends JpaRepository<Turmas, Integer> {

    List<Turmas> findByUsuarios(Usuario usuario);

    @Query("SELECT t FROM Turmas t JOIN t.usuarios u WHERE u.id = :usuarioId")
    List<Turmas> findByUsuarioId(@Param("usuarioId") Integer usuarioId);

    @Query("SELECT t FROM Turmas t JOIN t.usuarios u WHERE u.email = :email")
    List<Turmas> findByUsuarioEmail(@Param("email") String email);

    List<Turmas> findByLaboratorioId(Integer idLaboratorio);

    List<Turmas> findBySituacao(String situacao);
}