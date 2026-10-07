package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Integer> {

    @Query("SELECT m.insumo.idInsumo FROM MovimentacaoEstoque m WHERE m.insumo.ficha.idFicha = :fichaId AND DATE(m.dataMovimentacao) = CURRENT_DATE AND m.tipoMovimentacao = 'SAIDA'")
    List<Integer> findInsumosSeparadosHoje(@Param("fichaId") Integer fichaId);
}