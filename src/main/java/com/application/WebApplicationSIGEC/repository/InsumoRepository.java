package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    // A tabela insumo é o ESTOQUE (um registro por lote, sem id_ficha).
    // Retorna linhas [id_produto, estoque_total] somando os lotes não cancelados
    // e dentro da validade (mesmo critério usado na baixa).
    @Query(value = """
            SELECT id_produto, COALESCE(SUM(quantidade), 0)
            FROM insumo
            WHERE cancelado = 'N'
              AND (data_validade IS NULL OR data_validade >= CURDATE())
              AND id_produto IN (:idsProdutos)
            GROUP BY id_produto
            """, nativeQuery = true)
    List<Object[]> somarEstoquePorProduto(@Param("idsProdutos") Collection<Long> idsProdutos);

    // Lotes disponíveis de um produto, do que vence primeiro (FEFO).
    // FOR UPDATE trava os lotes durante a baixa para evitar duas baixas simultâneas.
    @Query(value = """
            SELECT *
            FROM insumo
            WHERE id_produto = :idProduto
              AND cancelado = 'N'
              AND quantidade > 0
              AND (data_validade IS NULL OR data_validade >= CURDATE())
            ORDER BY data_validade IS NULL, data_validade ASC, id_insumo ASC
            FOR UPDATE
            """, nativeQuery = true)
    List<Insumo> findLotesDisponiveis(@Param("idProduto") Long idProduto);
}