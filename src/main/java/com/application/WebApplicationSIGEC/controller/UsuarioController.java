package com.application.WebApplicationSIGEC.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.model.UsuarioForm;
import com.application.WebApplicationSIGEC.service.SessaoService;
import com.application.WebApplicationSIGEC.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private SessaoService sessaoService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    //metodo encerrar sessao
    private void encerrarSessaoSeExistir(HttpSession session) {
        if (session != null && session.getAttribute("usuarioLogado") != null) {
            sessaoService.encerrarSessao(session);
        }
    }



    @GetMapping("/cadastro")
    public String exibirCadastro(Model model, HttpSession session){

        encerrarSessaoSeExistir(session);

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
            if(erro.equals("A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.")){
                model.addAttribute("erro1", erro);
            }
            else{
                model.addAttribute("erro", erro);
            }
            model.addAttribute("usuarioForm", form);
            return "cadastro";
        }

        return "redirect:/login";
    }


    @GetMapping("/login")
    public String exibirLogin(Model model, HttpSession session) {

        encerrarSessaoSeExistir(session);

        model.addAttribute("usuarioForm", new UsuarioForm());
        model.addAttribute("tituloPagina", "Bem-Vindo");
        model.addAttribute("subTituloPagina", "Sistema de Gerenciamento de Estoque da Cozinha");

        return "login";
    }

    @PostMapping("/login")
    public String processarLogin(@ModelAttribute UsuarioForm form, Model model, HttpServletRequest request){
        Usuario usuario = usuarioService.autenticar(form.getEmail(), form.getSenha());
        if(usuario == null){
            model.addAttribute("erro", "E-mail ou senha incorreto!");
            return "login";
        }
        HttpSession session = request.getSession(true);
        session.setAttribute("usuarioLogado", usuario);
        //sessaoService.salvarUsuarioLogado(session,usuario);


        return "redirect:/home";

    }

    @GetMapping("/alterar-senha")
    public String exibirAlterarSenha(Model model, HttpSession session){

        encerrarSessaoSeExistir(session);

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

/*@GetMapping("/login")
public String exibirLogin(HttpSession session) {

    if (session != null) {
        sessaoService.encerrarSessao(session);
    }

    return "login";
}**/
