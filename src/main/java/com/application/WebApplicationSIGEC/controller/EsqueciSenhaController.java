package com.application.WebApplicationSIGEC.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/esqueci-senha")
public class EsqueciSenhaController {

    // 1. Exibe a tela para digitar o e-mail (solicitarCodigo.html)
    @GetMapping
    public String telaSolicitarCodigo() {
        return "solicitarCodigo";
    }

    // 2. Recebe o e-mail, envia o código e renderiza validarCodigo.html
    @PostMapping("/enviar-codigo")
    public String enviarCodigo(@RequestParam("email") String email, Model model) {
        // TODO: Lógica para gerar o código e enviar por e-mail
        model.addAttribute("email", email);
        return "validarCodigo";
    }

    // 3. Valida o código digitado e renderiza redefinirSenha.html
    @PostMapping("/validar-codigo")
    public String validarCodigo(@RequestParam("email") String email,
                                @RequestParam("codigo") String codigo,
                                Model model) {
        // TODO: Lógica para validar se o código bate com o enviado
        model.addAttribute("email", email);
        return "redefinirSenha";
    }

    // 4. Recebe a nova senha vinda do teu formulário HTML e salva
    @PostMapping("/salvar-senha")
    public String salvarNovaSenha(@RequestParam("email") String email,
                                  @RequestParam("novaSenha") String novaSenha,
                                  @RequestParam("confirmarSenha") String confirmarSenha,
                                  Model model) {

        // Validação básica se as senhas batem
        if (!novaSenha.equals(confirmarSenha)) {
            model.addAttribute("error", "As senhas não coincidem!");
            model.addAttribute("email", email);
            return "redefinirSenha";
        }

        // TODO: Atualizar a senha do usuário encriptada no banco (via UsuarioService)

        return "redirect:/login?senhaAlterada=true";
    }
}