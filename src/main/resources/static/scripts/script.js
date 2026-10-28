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
        iconeClicado.setAttribute("aria-label", "Ocultar senha");
    } else {
        // Se a senha estava visível e vai ocultar, colocamos o olho riscado
        campoSenha.type = "password";
        iconeClicado.classList.remove("fa-eye");
        iconeClicado.classList.add("fa-eye-slash");
        iconeClicado.setAttribute("aria-label", "Mostrar senha");
    }
}
function mostrarOcultarSenha(botao) {
    const container = botao.closest(".input-container");
    const campo = container?.querySelector("input");

    if (!campo) return;

    const mostrar = campo.type === "password";

    campo.type = mostrar ? "text" : "password";
    botao.classList.toggle("senha-visivel", mostrar);

    botao.setAttribute(
        "aria-label",
        mostrar ? "Ocultar senha" : "Mostrar senha"
    );
}
