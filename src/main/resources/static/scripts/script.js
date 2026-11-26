
document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        const campoEmail = form.querySelector("#email");
        const campoSenha = form.querySelector("#senha");

        if (campoEmail) {

            campoEmail.addEventListener("keydown", (event) => {

                const email = campoEmail.value;
                const posicaoArroba = email.indexOf("@");

                const teclasPermitidas = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Tab",
                    "Home",
                    "End"
                ];

                // Limite total de 256 caracteres
                if (email.length >= 256) {

                    if (
                        !teclasPermitidas.includes(event.key) &&
                        event.key !== "@"
                    ) {
                        event.preventDefault();
                    }

                    return;
                }

                // Limite de 64 caracteres antes do @
                if (posicaoArroba === -1 && email.length >= 64) {

                    if (
                        !teclasPermitidas.includes(event.key) &&
                        event.key !== "@"
                    ) {
                        event.preventDefault();
                    }

                }

            });

            // Proteção contra colagem
            campoEmail.addEventListener("input", () => {

                let email = campoEmail.value;

                // Limite total
                if (email.length > 256) {
                    email = email.substring(0, 256);
                }

                const posicaoArroba = email.indexOf("@");

                // Limite antes do @
                if (posicaoArroba > 64) {

                    const parteLocal = email.substring(0, 64);
                    const dominio = email.substring(posicaoArroba);

                    email = parteLocal + dominio;

                }

                campoEmail.value = email;

            });

        }

        // Limite de 70 caracteres na senha
        if (campoSenha) {

            campoSenha.addEventListener("input", () => {

                if (campoSenha.value.length > 70) {

                    campoSenha.value = campoSenha.value.substring(0, 70);

                }

            });

        }

        // Validação antes de enviar o formulário
        form.addEventListener("submit", (event) => {

            if (campoEmail) {

                const email = campoEmail.value.trim();

                const parteLocal = email.split("@")[0];

                if (parteLocal.length > 64) {

                    event.preventDefault();

                    campoEmail.setCustomValidity(
                        "O e-mail deve ter no máximo 64 caracteres antes do @."
                    );

                    campoEmail.reportValidity();

                    return;

                }

                campoEmail.setCustomValidity("");

            }

            if (campoSenha) {

                if (campoSenha.value.length > 70) {

                    event.preventDefault();

                    campoSenha.setCustomValidity(
                        "A senha deve ter no máximo 70 caracteres."
                    );

                    campoSenha.reportValidity();

                    return;

                }

                campoSenha.setCustomValidity("");

            }

            // Se tudo estiver válido, desabilita o botão
            const botao = form.querySelector('button[type="submit"]');

            if (botao) {

                botao.innerText = "Processando...";
                botao.disabled = true;

            }

        });

    });

});


// Mostrar ou ocultar senha
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
