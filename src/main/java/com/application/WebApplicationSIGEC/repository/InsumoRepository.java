package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    @Query("SELECT i FROM Insumo i JOIN FETCH i.produto WHERE i.ficha.id = :fichaId AND i.cancelado = 'N'")
    List<Insumo> findByFichaId(@Param("fichaId") Long fichaId);
}