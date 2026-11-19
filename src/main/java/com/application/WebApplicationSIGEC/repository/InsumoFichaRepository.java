package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.InsumoFicha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsumoFichaRepository extends JpaRepository<InsumoFicha, Long> {

    // Ingredientes da ficha: insumo_ficha.id_ficha = id da ficha clicada na home
    // (o mesmo id_ficha de turma_ficha/agendamento). Não junte turma_ficha aqui:
    // a mesma ficha existe em várias turmas e cada ingrediente viria repetido.
    @Query("SELECT i FROM InsumoFicha i JOIN FETCH i.produto WHERE i.ficha.id = :fichaId ORDER BY i.id")
    List<InsumoFicha> findByFichaId(@Param("fichaId") Long fichaId);

    @Query(value = """
    SELECT DISTINCT f.id_insumo_ficha
    FROM insumo_ficha f
    JOIN movimentacao_estoque m ON m.id_produto = f.id_produto
    WHERE f.id_ficha = :fichaId
      AND m.tipo_movimentacao = 'SAIDA'
      AND DATE(m.data_movimentacao) = CURDATE()
""", nativeQuery = true)
    List<Long> buscarIdsSeparadosHoje(@Param("fichaId") Long fichaId);
}
