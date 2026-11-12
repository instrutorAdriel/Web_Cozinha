package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Produto;
import com.application.WebApplicationSIGEC.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping("/pesquisar")
    public ResponseEntity<List<Produto>> pesquisarInsumos(@RequestParam String termo) {
        // Chama o método que criaste no Passo 1, passando a palavra digitada e a situação "A" (Ativa)
        List<Produto> resultados = produtoRepository.findByNomeProdutoContainingIgnoreCaseAndSituacao(termo, "A");

        // Devolve os dados para a tela
        return ResponseEntity.ok(resultados);
    }
}