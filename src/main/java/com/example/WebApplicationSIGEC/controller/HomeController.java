package com.example.WebApplicationSIGEC.controller;

import com.example.primeiroAppSpring.model.UsuarioForm;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/")
public class HomeController {


@GetMapping("/home")
public String exibirHome(Model model){

    return "home";
}
}