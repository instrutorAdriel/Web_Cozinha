package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    @Query(value = """
        SELECT inf.id_insumo_ficha
        FROM movimentacao_estoque m
        JOIN insumo_ficha inf ON inf.id_produto = m.id_produto
        WHERE inf.id_ficha = :fichaId
          AND DATE(m.data_movimentacao) = CURRENT_DATE
          AND m.tipo_movimentacao = 'SAIDA'
    """, nativeQuery = true)
    List<Long> findInsumosSeparadosHoje(@Param("fichaId") Long fichaId);
}
