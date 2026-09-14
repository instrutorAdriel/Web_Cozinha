package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.Insumos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsumosRepository extends JpaRepository<Insumos, Integer> {
    List<Insumos> findByFichaId(Integer idFicha);
    List<Insumos> findByProdutoId(Integer idProduto);
    List<Insumos> findByCancelado(String cancelado);
}