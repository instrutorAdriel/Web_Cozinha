document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", (event) => {

            const botao = form.querySelector("button");

            botao.innerText = "Processando...";
            botao.disabled = true;

        });

    });

});
function mostrarOcultarSenha(iconeClicado) {
    // Pega a 'div' (caixa-senha) onde o ícone está dentro
    const caixaSenha = iconeClicado.parentElement;
    // Pega o 'input' de senha que está dentro dessa mesma div
    const campoSenha = caixaSenha.querySelector('input');

    if (campoSenha.type === "password") {
        // Se a senha estava oculta e vai aparecer, colocamos o olho aberto
        campoSenha.type = "text";
        iconeClicado.classList.remove("fa-eye-slash");
        iconeClicado.classList.add("fa-eye");
    } else {
        // Se a senha estava visível e vai ocultar, colocamos o olho riscado
        campoSenha.type = "password";
        iconeClicado.classList.remove("fa-eye");
        iconeClicado.classList.add("fa-eye-slash");
    }
}

// ==========================================
// 1. TELA DE CADASTRO: SALVAR A FOTO E TRAVAR O HOVER
// ==========================================
const inputFoto = document.getElementById('foto-upload');
const imagemPerfil = document.querySelector('.img-padrao');
const labelUpload = document.querySelector('.perfil-upload-label');

if (inputFoto && imagemPerfil && labelUpload) {
    inputFoto.addEventListener('change', function(evento) {
        const arquivo = evento.target.files[0];

        if (arquivo) {
            // O FileReader "lê" a foto do seu PC e a transforma em um texto (Base64)
            const leitor = new FileReader();

            leitor.onload = function(e) {
                const fotoTextoBase64 = e.target.result;

                // 1. Atualiza a imagem na tela de cadastro
                imagemPerfil.src = fotoTextoBase64;

                // 2. Adiciona a classe que avisa o CSS para DESLIGAR o hover da foto com o "+"
                labelUpload.classList.add('tem-foto');

                // 3. Salva esse texto gigante da foto no pendrive do navegador (localStorage)
                localStorage.setItem('minhaFotoSalva', fotoTextoBase64);
            };

            // Dispara o comando para o leitor começar a trabalhar
            leitor.readAsDataURL(arquivo);
        }
    });
}

// ==========================================
// 2. TELA DE LOGIN: REVELAR FOTO AO DIGITAR E-MAIL
// ==========================================
const campoEmailLogin = document.getElementById('email');
const avatarLogin = document.getElementById('avatar-login');

// Verifica se os elementos existem (para garantir que só rode na tela de Login)
if (campoEmailLogin && avatarLogin) {

    // O evento 'blur' escuta o exato momento que o usuário tira o foco da caixa de texto
    campoEmailLogin.addEventListener('blur', function() {

        // Pede para o navegador buscar a foto salva no cofre
        const fotoGuardada = localStorage.getItem('minhaFotoSalva');

        // Se a pessoa digitou um e-mail válido E a foto existe no cofre...
        if (campoEmailLogin.value.trim() !== "" && fotoGuardada) {
            avatarLogin.src = fotoGuardada; // Injeta a foto na tag
            avatarLogin.style.display = 'block'; // Muda a tag de invisível para visível
        } else {
            avatarLogin.style.display = 'none'; // Garante que fique escondida se apagar o e-mail
        }
    });
}