package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.SolicitacaoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitacaoInsumoRepository extends JpaRepository<SolicitacaoInsumo, Long> {

    @Query("SELECT s FROM SolicitacaoInsumo s WHERE s.id_usuario.id = :idUsuario")
    List<SolicitacaoInsumo> buscarPorUsuario(@Param("idUsuario") Long idUsuario);

    List<SolicitacaoInsumo> findBySituacao(String situacao);
}