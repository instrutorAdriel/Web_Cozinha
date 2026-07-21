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
// PRÉ-VISUALIZAÇÃO DA FOTO DE PERFIL
// ==========================================

// 1. Selecionamos o input oculto e a imagem que está aparecendo na tela
const inputFoto = document.getElementById('foto-upload');
const imagemPerfil = document.querySelector('.img-padrao');

// 2. Só executamos o código se esses elementos existirem na página (evita erros em outras páginas)
if (inputFoto && imagemPerfil) {

    // 3. Ficamos "escutando" para ver se o usuário escolheu algum arquivo
    inputFoto.addEventListener('change', function(evento) {

        // Pega o primeiro arquivo que o usuário selecionou
        const arquivo = evento.target.files[0];

        if (arquivo) {
            // Cria um link temporário na memória do navegador para essa imagem
            const urlTemporaria = URL.createObjectURL(arquivo);

            // Troca o caminho da imagem padrão pelo link da foto do usuário!
            imagemPerfil.src = urlTemporaria;
        }
    });
}