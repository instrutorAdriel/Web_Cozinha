package com.example.primeiroAppSpring.controller;

import com.example.primeiroAppSpring.model.UsuarioForm;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Controller
@RequestMapping("/")
public class HomeController {


@GetMapping("/home")
public String exibirHome(Model model){
    LocalDate hoje = LocalDate.now();
    DateTimeFormatter formatador = DateTimeFormatter.ofPattern("EEEE, dd 'de' MMMM", new Locale("pt", "BR"));
    String dataAtualFormatada = hoje.format(formatador).toUpperCase();

    // Envia para o HTML com o nome "dataDeHoje"
    model.addAttribute("dataDeHoje", dataAtualFormatada);
    return "home";
}
}