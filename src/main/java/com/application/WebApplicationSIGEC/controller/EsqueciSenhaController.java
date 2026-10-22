package com.application.WebApplicationSIGEC.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class EsqueciSenhaController {

    // Redireciona a rota antiga /alterar-senha para a nova tela de e-mail
    @GetMapping("/alterar-senha")
    public String redirecionarAlterarSenha() {
        return "solicitarCodigo";
    }

    // ETAPA 1: Renderiza a tela para digitar o e-mail
    @GetMapping("/esqueci-senha")
    public String telaSolicitarCodigo() {
        return "solicitarCodigo";
    }

    // ETAPA 1 -> 2: Processa o e-mail e envia para a tela de digitar o código
    @PostMapping("/esqueci-senha/enviar-codigo")
    public String enviarCodigo(@RequestParam("email") String email, Model model) {
        // TODO: Lógica para enviar o e-mail com o código de 6 dígitos
        model.addAttribute("email", email);
        return "validarCodigo";
    }

    // ETAPA 2 -> 3: Valida o código digitado e leva para a tela de nova senha
    @PostMapping("/esqueci-senha/validar-codigo")
    public String validarCodigo(@RequestParam("email") String email,
                                @RequestParam("codigo") String codigo,
                                Model model) {
        // TODO: Validar se o código informado bate com o gerado
        model.addAttribute("email", email);
        return "redefinirSenha";
    }

    // ETAPA 3: Recebe a nova senha e salva no banco de dados
    @PostMapping("/esqueci-senha/salvar-senha")
    public String salvarNovaSenha(@RequestParam("email") String email,
                                  @RequestParam("novaSenha") String novaSenha,
                                  @RequestParam("confirmarSenha") String confirmarSenha,
                                  Model model) {

        if (!novaSenha.equals(confirmarSenha)) {
            model.addAttribute("error", "As senhas não coincidem!");
            model.addAttribute("email", email);
            return "redefinirSenha";
        }

        // TODO: Atualizar a senha do usuário no MySQL (via UsuarioRepository / UsuarioService)

        return "redirect:/login?senhaAlterada=true";
    }
}