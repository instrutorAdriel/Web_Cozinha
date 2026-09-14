package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Produto;
import com.application.WebApplicationSIGEC.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<Produto> listarTodosAtivos() {
        return produtoRepository.findBySituacao("A");
    }

    @Transactional(readOnly = true)
    public List<Produto> listarPorCategoria(Integer idCategoria) {
        return produtoRepository.findByCategoriaId(idCategoria);
    }

    @Transactional
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    @Transactional
    public void desativar(Integer idProduto) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + idProduto));
        produto.setSituacao("I");
        produtoRepository.save(produto);
    }
}