package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Aluno;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AlunoController {
    @GetMapping("/aluno")
    public Aluno buscarAluno(){
        return new Aluno("Fulano de Tal","Desenvolvimento de Sistemas");
    }
}
