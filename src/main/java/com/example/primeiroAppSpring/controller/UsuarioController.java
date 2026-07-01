package com.example.primeiroAppSpring.controller;

import com.example.primeiroAppSpring.model.Usuario;
import com.example.primeiroAppSpring.model.UsuarioForm;
import com.example.primeiroAppSpring.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/cadastro")
    public String exibirCadastro(Model model){
        //Criando formulário vazio
        model.addAttribute("usuarioForm", new UsuarioForm());

        model.addAttribute("tituloPagina", "Cadastro");
        model.addAttribute("subTituloPagina", "Sistema de Gerenciamento de Estoque da Cozinha");

        return "cadastro";
    }
    @PostMapping("/cadastro")
    public String processarCadastro(@ModelAttribute UsuarioForm form, Model model){
        String erro = usuarioService.cadastrar(form);

        if(erro!=null){
            model.addAttribute("erro", erro);
            model.addAttribute("usuarioForm", form);
            return "cadastro";
        }

        return "redirect:/login";
    }

    @GetMapping("/login")
    public String exibirLogin(Model model){
        //Criando formulário vazio
        model.addAttribute("usuarioForm", new UsuarioForm());

        model.addAttribute("tituloPagina", "Bem-Vindo");
        model.addAttribute("subTituloPagina", "Sistema de Gerenciamento de Estoque da Cozinha");

        return "login";
    }
    @PostMapping("/login")
    public String processarLogin(@ModelAttribute UsuarioForm form, Model model){
        Usuario usuario = usuarioService.autenticar(form.getEmail(), form.getSenha());
        if(usuario == null){
            model.addAttribute("erro","E-mail ou senha incorreto!");
            return "login";
        }
        return "redirect:/";
    }

    @GetMapping("/alterar-senha")
    public String exibirAlterarSenha(Model model){
        //Criando formulário vazio
        model.addAttribute("usuarioForm", new UsuarioForm());

        model.addAttribute("tituloPagina", "Alterar Senha");
        model.addAttribute("subTituloPagina", "Informe seus dados para alterar a senha");

        return "alterarSenha";
    }
    @PostMapping("/alterar-senha")
    public String processarAlterarSenha(@ModelAttribute UsuarioForm form, Model model){
        String erro = usuarioService.alterarSenha(form);

        if(erro!=null){
            model.addAttribute("erro", erro);
            return "alterarSenha";
        }

        return "redirect:/login";
    }

}
