package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Integer> {
    List<MovimentacaoEstoque> findByProdutoId(Integer idProduto);
    List<MovimentacaoEstoque> findByTipoMovimentacao(MovimentacaoEstoque.TipoMovimentacao tipo);
}