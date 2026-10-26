package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.service.EmailService;
import com.application.WebApplicationSIGEC.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Random;

@Controller
public class EsqueciSenhaController {

    private final EmailService emailService;
    private final UsuarioService usuarioService;

    // Injeção de dependências via construtor
    public EsqueciSenhaController(EmailService emailService, UsuarioService usuarioService) {
        this.emailService = emailService;
        this.usuarioService = usuarioService;
    }

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

    // ETAPA 1 -> 2: Processa o e-mail, gera o código de 6 dígitos e envia por e-mail
    @PostMapping("/esqueci-senha/enviar-codigo")
    public String enviarCodigo(@RequestParam("email") String email, HttpSession session, Model model) {
        // Gerar código aleatório de 6 dígitos
        String codigoGerado = String.format("%06d", new Random().nextInt(999999));

        try {
            // Dispara o e-mail real via EmailService
            emailService.enviarCodigoRecuperacao(email, codigoGerado);

            // Armazena temporariamente o código e e-mail na sessão do usuário
            session.setAttribute("codigoRecuperacao", codigoGerado);
            session.setAttribute("emailRecuperacao", email);

            model.addAttribute("email", email);
            return "validarCodigo";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("erro", "Erro ao enviar e-mail. Verifique o endereço digitado ou as configurações de SMTP.");
            return "solicitarCodigo";
        }
    }

    // ETAPA 2 -> 3: Valida se o código de 6 dígitos digitado está correto
    @PostMapping("/esqueci-senha/validar-codigo")
    public String validarCodigo(@RequestParam("codigo") String codigo, HttpSession session, Model model) {
        String codigoSalvo = (String) session.getAttribute("codigoRecuperacao");
        String emailSalvo = (String) session.getAttribute("emailRecuperacao");

        if (codigoSalvo != null && codigoSalvo.equals(codigo.trim())) {
            model.addAttribute("email", emailSalvo);
            return "redefinirSenha";
        } else {
            model.addAttribute("erro", "Código incorreto ou expirado! Tente novamente.");
            model.addAttribute("email", emailSalvo);
            return "validarCodigo";
        }
    }

    // ETAPA 3: Valida a força da nova senha e salva criptografada no banco de dados
    @PostMapping("/esqueci-senha/salvar-senha")
    public String salvarNovaSenha(@RequestParam("novaSenha") String novaSenha,
                                  @RequestParam("confirmarSenha") String confirmarSenha,
                                  HttpSession session,
                                  Model model) {

        String emailSalvo = (String) session.getAttribute("emailRecuperacao");

        // 1. Valida se as senhas conferem
        if (!novaSenha.equals(confirmarSenha)) {
            model.addAttribute("erro", "As senhas não coincidem!");
            model.addAttribute("email", emailSalvo);
            return "redefinirSenha";
        }

        // 2. Validação de Senha Forte via Regex
        // Exige: Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&)
        String regexSenhaForte = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!novaSenha.matches(regexSenhaForte)) {
            model.addAttribute("erro", "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
            model.addAttribute("email", emailSalvo);
            return "redefinirSenha";
        }

        // 3. Atualiza a senha no banco de dados
        try {
            usuarioService.atualizarSenhaPorEmail(emailSalvo, novaSenha);

            // Limpa as variáveis da sessão após finalizar o processo com sucesso
            session.removeAttribute("codigoRecuperacao");
            session.removeAttribute("emailRecuperacao");

            return "redirect:/?senhaAlterada=true";
        } catch (Exception e) {
            model.addAttribute("erro", "Erro ao atualizar a senha no banco de dados: " + e.getMessage());
            model.addAttribute("email", emailSalvo);
            return "redefinirSenha";
        }
    }
}