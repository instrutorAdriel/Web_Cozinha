package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Turmas;
import com.application.WebApplicationSIGEC.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TurmasRepository extends JpaRepository<Turmas, Integer> {
    List<Turmas> findByUsuarios(Usuario usuarios);
}
