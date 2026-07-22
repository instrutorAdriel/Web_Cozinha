package com.application.WebApplicationSIGEC.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.application.WebApplicationSIGEC.model.Usuario;
import com.application.WebApplicationSIGEC.model.UsuarioForm;
import com.application.WebApplicationSIGEC.repository.UsuarioRepository;
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
    private UsuarioRepository usuarioRepository;
    @Autowired
    private SessaoService sessaoService;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
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

    @GetMapping("/usuario/foto")
    @ResponseBody
    public ResponseEntity<byte[]> exibirFotoUsuarioLogado(HttpSession session) {
        if (session != null) {
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
            if (usuarioLogado != null && usuarioLogado.getId() != null) {
                Optional<Usuario> opt = usuarioRepository.findById(usuarioLogado.getId());
                if (opt.isPresent() && opt.get().getFoto() != null && opt.get().getFoto().length > 0) {
                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_JPEG)
                            .body(opt.get().getFoto());
                }
            }
        }
        return obterFotoPadrao();
    }

    @GetMapping("/usuario/foto/by-email")
    @ResponseBody
    public ResponseEntity<byte[]> exibirFotoPorEmail(@RequestParam("email") String email) {
        if (email != null && !email.trim().isEmpty()) {
            Optional<Usuario> opt = usuarioRepository.findByEmail(email.trim());
            if (opt.isPresent() && opt.get().getFoto() != null && opt.get().getFoto().length > 0) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(opt.get().getFoto());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/usuario/foto/upload")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> uploadFotoPerfil(
            @RequestParam(value = "fotoPerfil", required = false) MultipartFile file,
            HttpSession session) {
        Map<String, Object> resposta = new HashMap<>();

        if (session == null || session.getAttribute("usuarioLogado") == null) {
            resposta.put("success", false);
            resposta.put("message", "Usuário não autenticado.");
            return ResponseEntity.status(401).body(resposta);
        }

        if (file == null || file.isEmpty()) {
            resposta.put("success", false);
            resposta.put("message", "Arquivo de imagem vazio.");
            return ResponseEntity.badRequest().body(resposta);
        }

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        try {
            Usuario usuarioAtualizado = usuarioService.atualizarFoto(usuarioLogado.getId(), file.getBytes());
            if (usuarioAtualizado != null) {
                session.setAttribute("usuarioLogado", usuarioAtualizado);
                resposta.put("success", true);
                resposta.put("message", "Foto atualizada com sucesso!");
                return ResponseEntity.ok(resposta);
            }
        } catch (IOException e) {
            resposta.put("success", false);
            resposta.put("message", "Erro ao processar imagem: " + e.getMessage());
        }

        resposta.put("success", false);
        resposta.put("message", "Erro ao atualizar foto.");
        return ResponseEntity.status(500).body(resposta);
    }

    private ResponseEntity<byte[]> obterFotoPadrao() {
        try (InputStream is = getClass().getResourceAsStream("/static/img/Ícone de Perfil Cadastro (110 x 110 px).png")) {
            if (is != null) {
                return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(is.readAllBytes());
            }
        } catch (Exception ignored) {}
        return ResponseEntity.notFound().build();
    }
}


/*@GetMapping("/login")
public String exibirLogin(HttpSession session) {

    if (session != null) {
        sessaoService.encerrarSessao(session);
    }

    return "login";
}**/
