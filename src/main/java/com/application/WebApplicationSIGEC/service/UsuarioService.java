package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.model.UsuarioForm;
import com.application.WebApplicationSIGEC.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String cadastrar(UsuarioForm form){
        if(!form.getSenha().equals(form.getConfirmarSenha())){
            return "As senhas não conferem";
        }

        String senhaRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!form.getSenha().matches(senhaRegex)) {
            return "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.";
        }

        if(usuarioRepository.existsByEmail(form.getEmail())){
            return "E-mail já cadastrado no banco";
        }

        if(!form.getEmail().endsWith("@df.senac.br")){
            return "E-mail inválido. Insira um e-mail @df.senac.br";
        }

        String senhaCriptografada = encoder.encode(form.getSenha());

        Usuario novoUsuario = new Usuario(form.getNome(), form.getEmail(), senhaCriptografada);

        // Salva a foto de perfil enviada pelo usuário no banco de dados
        try {
            if(form.getFoto() != null && !form.getFoto().isEmpty()){
                novoUsuario.setFoto(form.getFoto().getBytes());
            }
        } catch (IOException e) {
            return "Erro ao processar a foto de perfil.";
        }

        usuarioRepository.save(novoUsuario);

        return null;
    }

    public Usuario autenticar(String email,String senha){
        Optional<Usuario> resultado = usuarioRepository.findByEmail(email);

        if(resultado.isEmpty()){
            return null;
        }

        Usuario usuario = resultado.get();

        if(!encoder.matches(senha, usuario.getSenha())){
            return null;
        }

        return usuario;
    }

    public String alterarSenha(UsuarioForm form){
        if(!form.getSenha().equals(form.getConfirmarSenha())){
            return "As senhas não conferem";
        }

        Optional<Usuario> resultado = usuarioRepository.findByEmail(form.getEmail());

        if(resultado.isEmpty()){
            return "E-mail não encontrado!";
        }

        Usuario usuario = resultado.get();
        usuario.setSenha(encoder.encode(form.getSenha()));

        usuarioRepository.save(usuario);

        return null;
    }
}