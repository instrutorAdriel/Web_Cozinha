package com.example.primeiroAppSpring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // 1. O Spring precisa desta anotação para saber que é um controller de páginas
public class ReceitaController {

    @GetMapping("/telaReceitas") // 2. Mapeia a URL /receitas
    public String receitas() {
        return "telaReceitas"; // 3. Procura por receitas.html na pasta templates
    }

} // O fechamento de chave que estava sobrando no seu exemplo