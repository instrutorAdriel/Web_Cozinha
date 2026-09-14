package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    List<Produto> findByCategoriaId(Integer idCategoria);
    List<Produto> findBySituacao(String situacao);
}