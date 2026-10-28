package com.application.WebApplicationSIGEC.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public void enviarCodigoRecuperacao(String paraEmail, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(paraEmail);
        mensagem.setSubject("SIGEC - Código de Recuperação de Senha");
        mensagem.setText("Olá,\n\nSeu código de verificação para redefinir a senha no SIGEC é: "
                + codigo + "\n\nEste código é válido para alteração de senha.");

        mailSender.send(mensagem);
    }
}