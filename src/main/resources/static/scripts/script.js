document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", (event) => {
            const botao = form.querySelector("button");
            if (botao) {
                botao.innerText = "Processando...";
                botao.disabled = true;
            }
        });
    });

    // ==========================================
    // 1. TELA DE CADASTRO: PREVISÃO DA FOTO (SEM LOCALSTORAGE)
    // ==========================================
    const inputFoto = document.getElementById('foto-upload');
    const imagemPerfil = document.querySelector('.perfil-upload-label .img-padrao');

    if (inputFoto && imagemPerfil) {
        inputFoto.addEventListener('change', function(evento) {
            const arquivo = evento.target.files[0];
            if (arquivo) {
                const leitor = new FileReader();
                leitor.onload = function(e) {
                    imagemPerfil.src = e.target.result;
                };
                leitor.readAsDataURL(arquivo);
            }
        });
    }

    // ==========================================
    // 2. TELA DE LOGIN: CARREGAR FOTO DO BANCO DE DADOS AO DIGITAR E-MAIL
    // ==========================================
    const campoEmailLogin = document.getElementById('email');
    const avatarLogin = document.getElementById('avatar-login');

    if (campoEmailLogin && avatarLogin) {
        avatarLogin.onerror = function() {
            avatarLogin.style.display = 'none';
        };
        avatarLogin.onload = function() {
            avatarLogin.style.display = 'block';
        };

        campoEmailLogin.addEventListener('blur', function() {
            const emailVal = campoEmailLogin.value.trim();
            if (emailVal !== "") {
                avatarLogin.src = '/usuario/foto/by-email?email=' + encodeURIComponent(emailVal) + '&v=' + new Date().getTime();
            } else {
                avatarLogin.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 3. ALTERAÇÃO DE FOTO NO CABEÇALHO (PÁGINAS LOGADAS)
    // ==========================================
    const inputHeaderFoto = document.getElementById('foto-header-upload');
    const avatarHeaderImg = document.getElementById('avatar-header-img');

    if (inputHeaderFoto) {
        inputHeaderFoto.addEventListener('change', function(evento) {
            const arquivo = evento.target.files[0];
            if (arquivo) {
                const formData = new FormData();
                formData.append('fotoPerfil', arquivo);

                fetch('/usuario/foto/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const novaUrl = '/usuario/foto?v=' + new Date().getTime();
                        if (avatarHeaderImg) {
                            avatarHeaderImg.src = novaUrl;
                        }
                    } else {
                        alert(data.message || "Erro ao atualizar foto de perfil.");
                    }
                })
                .catch(err => {
                    console.error("Erro no upload da foto de perfil:", err);
                });
            }
        });
    }
});

function mostrarOcultarSenha(iconeClicado) {
    const caixaSenha = iconeClicado.parentElement;
    const campoSenha = caixaSenha.querySelector('input');

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        iconeClicado.classList.remove("fa-eye-slash");
        iconeClicado.classList.add("fa-eye");
    } else {
        campoSenha.type = "password";
        iconeClicado.classList.remove("fa-eye");
        iconeClicado.classList.add("fa-eye-slash");
    }
}