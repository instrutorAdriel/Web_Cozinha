package com.application.WebApplicationSIGEC.repository;

import com.application.WebApplicationSIGEC.model.SolicitacaoUtensilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitacaoUtensilioRepository extends JpaRepository<SolicitacaoUtensilio, Long> {

    @Query("SELECT s FROM SolicitacaoUtensilio s WHERE s.id_usuario.id = :idUsuario")
    List<SolicitacaoUtensilio> buscarPorUsuario(@Param("idUsuario") Long idUsuario);

    @Query("SELECT s FROM SolicitacaoUtensilio s WHERE s.id_usuario.id = :idUsuario AND s.data_solicitacao LIKE :dataPrefixo ORDER BY s.data_solicitacao DESC")
    List<SolicitacaoUtensilio> buscarDoDiaPorUsuario(@Param("idUsuario") Long idUsuario, @Param("dataPrefixo") String dataPrefixo);

    List<SolicitacaoUtensilio> findBySituacao(String situacao);
}