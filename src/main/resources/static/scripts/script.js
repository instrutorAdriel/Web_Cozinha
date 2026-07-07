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
        campoSenha.type = "text";
        iconeClicado.classList.remove("fa-eye");
        iconeClicado.classList.add("fa-eye-slash");
    } else {
        campoSenha.type = "password";
        iconeClicado.classList.remove("fa-eye-slash");
        iconeClicado.classList.add("fa-eye");
    }
}

