package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.ChecklistUtensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistUtensilioRepository extends JpaRepository<ChecklistUtensilio, Long> {

    @Query("SELECT c FROM ChecklistUtensilio c JOIN FETCH c.utensilio WHERE c.ficha.id = :fichaId AND c.situacao = 'A'")
    List<ChecklistUtensilio> findByFichaId(@Param("fichaId") Long fichaId);
}