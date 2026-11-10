package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    // findInsumosSeparadosHoje foi removido: a consulta usava insumo.ficha, que não existe mais.
    // A verificação de "separado hoje" agora é feita em HomeService.buscarInsumosSeparadosHoje,
    // via insumo_ficha + movimentacao_estoque.
}