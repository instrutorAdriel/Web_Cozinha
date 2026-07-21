package com.application.WebApplicationSIGEC.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReceitaController {
    @GetMapping("/receitas")
    public String receitas() {
        return "receita";
    }
}
