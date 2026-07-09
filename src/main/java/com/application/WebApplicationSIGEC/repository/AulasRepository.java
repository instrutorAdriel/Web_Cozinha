package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Aulas; // Note que seu model usa o plural "Aulas"
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AulasRepository extends JpaRepository<Aulas, Long> {

    // Método de busca simples por data da aula
    List<Aulas> findByData(LocalDate data);

    // Consulta customizada (Lembre-se de trocar "dataDisponivel" pelo nome real que está em Fichas.java)
    @Query("SELECT a FROM Aulas a " +
            "JOIN a.ficha f " +
            "WHERE a.data = :data " +
            "AND f.data = :data")
    List<Aulas> findAulasComReceitasDoDia(@Param("data") LocalDate data);
}