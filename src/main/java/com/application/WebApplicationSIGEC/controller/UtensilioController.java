package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Utensilio;
import com.application.WebApplicationSIGEC.repository.UtensilioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/utensilios")
public class UtensilioController {

    @Autowired
    private UtensilioRepository utensilioRepository;

    @GetMapping("/pesquisar")
    public ResponseEntity<List<Utensilio>> pesquisarUtensilios(@RequestParam String termo) {
        List<Utensilio> resultados = utensilioRepository.findByNomeUtensilioContainingIgnoreCase(termo);
        return ResponseEntity.ok(resultados);
    }
}