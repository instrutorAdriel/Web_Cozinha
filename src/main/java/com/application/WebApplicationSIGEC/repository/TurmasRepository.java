package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TurmasRepository extends JpaRepository<Turmas, Integer> {
    List<Turmas> findByUsuarios(Usuario usuarios);

    @Query("SELECT t FROM Turmas t JOIN t.usuarios u WHERE u.id = :usuarioId")
    List<Turmas> findByUsuarioId(@Param("usuarioId") int usuarioId);
}
