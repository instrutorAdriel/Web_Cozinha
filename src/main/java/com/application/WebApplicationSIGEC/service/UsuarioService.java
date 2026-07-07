package com.application.WebApplicationSIGEC.service;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.model.UsuarioForm;
import com.application.WebApplicationSIGEC.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        IO.println(form.getEmail()+"esse é o email");
        if(usuarioRepository.existsByEmail(form.getEmail())){
            return "E-mail já cadastrado no banco";
        }

        if(!form.getEmail().endsWith("@df.senac.br")){
            return "E-mail não valido. Insira um e-mail @df.senac.br";
        }

        String senhaCriptografada = encoder.encode(form.getSenha());

        Usuario novoUsuario = new Usuario(form.getNome(), form.getEmail(), senhaCriptografada);

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
