package com.example.primeiroAppSpring.controller;

import com.example.primeiroAppSpring.model.Usuario;
import com.example.primeiroAppSpring.model.UsuarioForm;
import com.example.primeiroAppSpring.service.SessaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class HomeController {

    @Autowired
    private SessaoService sessaoService;

@GetMapping("/home")
public String exibirHome(Model model, HttpSession session){
    Usuario usuarioLogado = sessaoService.buscarUsuarioLogado(session);

    if(usuarioLogado != null){
        IO.println("Usuario não encontrado na sessão");
        return  "redirect:/login";
    }

    
    String nomeCompleto = usuarioLogado.getNome();
    String primeiroNome =nomeCompleto.split(" ")[0];
    model.addAttribute("nomeUsuario", primeiroNome);



    return "home";
}
}