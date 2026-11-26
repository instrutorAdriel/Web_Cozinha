/**
 * notificacao.js - Gerenciamento do Painel de Notificações com Dados Reais do Banco (SIGEC)
 */

document.addEventListener("DOMContentLoaded", () => {
    // ===== INTERCEPTADOR GLOBAL DE SESSÃO (FORÇA F5 / LOGIN NO RERUN) =====
    if (!window.__sigecSessionGuard) {
        window.__sigecSessionGuard = true;

        const fetchOriginal = window.fetch;
        window.fetch = async (...args) => {
            const response = await fetchOriginal(...args);
            if (response.status === 401) {
                // Força o reload (F5) -> o AutenticacaoInterceptor barra e manda pro "/"
                window.location.reload();
            }
            return response;
        };

        // Força F5 se o usuário apertar "Voltar" no navegador e pegar tela em cache
        window.addEventListener("pageshow", (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        });

        // Assim que você der Rerun no IntelliJ e voltar pra aba do navegador,
        // ele já checa se a sessão morreu e força o F5 sozinho (sem precisar clicar em nada)
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                fetch("/api/notificacoes").catch(() => {});
            }
        });
    }
    iniciarNotificacoes();
});

function iniciarNotificacoes() {
    const notifBtn = document.getElementById("notif-btn");
    const notifPanel = document.getElementById("notif-panel");
    const notifList = document.getElementById("notif-list") || document.querySelector(".notif-list");
    const notifClear = document.getElementById("notif-clear");

    if (!notifBtn || !notifPanel) return;

    // Carregamento inicial ao abrir a página
    if (notifList) {
        carregarNotificacoesReais(notifList);
        // Verifica periodicamente se o Desktop aprovou/avaliou as solicitações
        setInterval(() => {
            carregarNotificacoesReais(notifList);
        }, 10000);
    }

    // Clique no botão do sino (TopBar)
    notifBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const containerLista = document.getElementById("notif-list") || document.querySelector(".notif-list");
        if (containerLista) {
            carregarNotificacoesReais(containerLista);
        }

        const estaAberto = notifPanel.classList.contains("active") || notifPanel.classList.contains("show");

        if (estaAberto) {
            fecharPainel();
        } else {
            abrirPainel();
        }
    };

    if (notifClear) {
        notifClear.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            notificacoesLidas = true;
            const badge = document.getElementById("notif-badge");
            if (badge) badge.hidden = true;
            pararSino();
        };
    }

    notifPanel.onclick = function (e) {
        e.stopPropagation();
    };

    document.onclick = function () {
        fecharPainel();
    };

    function abrirPainel() {
        notifPanel.classList.add("active", "show");
        notifBtn.setAttribute("aria-expanded", "true");
    }

    function fecharPainel() {
        notifPanel.classList.remove("active", "show");
        notifBtn.setAttribute("aria-expanded", "false");

        // Se fechou o painel sem marcar como lida e ainda há pendente do Desktop, continua balançando
        if (temPendente && !notificacoesLidas) {
            balancarSino();
        }
    }
}

let animacaoSino = null;
let notificacoesLidas = false;
let temPendente = false;
let idsPendentesConhecidos = new Set();

/**
 * Consome o endpoint /api/notificacoes e renderiza os cards com as 3 colunas
 */
function carregarNotificacoesReais(container) {
    if (!container) return;

    fetch("/api/notificacoes")
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar notificações do servidor");
            return response.json();
        })
        .then(notificacoes => {
            container.innerHTML = "";

            if (!notificacoes || notificacoes.length === 0) {
                container.innerHTML = '<p style="padding:15px; text-align:center; color:#777; font-size:0.8rem;">Nenhuma notificação encontrada.</p>';
                const badge = document.getElementById("notif-badge");
                if (badge) badge.hidden = true;
                temPendente = false;
                pararSino();
                return;
            }

            // Verifica se surgiu uma nova solicitação pendente (para reativar o alerta mesmo se já tinha clicado em limpar antes)
            const pendentesAtuais = notificacoes.filter(item => item.status === "pendente");
            const chegouNovaPendente = pendentesAtuais.some(item => !idsPendentesConhecidos.has(`${item.tipo}-${item.id}`));

            if (chegouNovaPendente) {
                notificacoesLidas = false;
            }

            idsPendentesConhecidos = new Set(pendentesAtuais.map(item => `${item.tipo}-${item.id}`));
            temPendente = pendentesAtuais.length > 0;

            notificacoes.forEach((item) => {
                const cardHtml = `
      <div class="notif-item">
        <!-- Coluna 1: Título Fixo + Subtítulo do Tipo -->
        <div class="notif-col-title">
          <strong class="notif-item-title">Solicitação</strong>
          <span class="notif-item-subtitle">${item.tipo}</span>
        </div>

        <!-- Coluna 2: Resumo / Detalhes -->
        <div class="notif-col-detail">
          <p class="notif-item-detail">${item.detalhe}</p>
        </div>

        <!-- Coluna 3: Tag de Status (Pendente, Negado, Aprovado) -->
        <div class="notif-col-status">
          <span class="tag-status ${item.status}">${item.statusTexto}</span>
        </div>
      </div>
    `;
                container.innerHTML += cardHtml;
            });

            const badge = document.getElementById("notif-badge");

            // Continua balançando enquanto não for marcada como lida E não for aprovada/avaliada pelo Desktop
            if (temPendente && !notificacoesLidas) {
                if (badge) badge.hidden = false;
                balancarSino();
            } else {
                if (badge) badge.hidden = notificacoesLidas || !temPendente;
                pararSino();
            }

        })
        .catch(erro => {
            console.error("Erro no carregamento das notificações:", erro);
            container.innerHTML = '<p style="padding:15px; color:red; text-align:center; font-size:0.8rem;">Erro ao carregar notificações.</p>';
        });
}

/**
 * Anima o ícone do sino balançando continuamente até o usuário clicar
 */
function balancarSino() {
    const iconeSino = document.querySelector("#notif-btn .material-symbols-outlined");
    if (!iconeSino) return;

    if (animacaoSino) return;

    iconeSino.style.transformOrigin = "top center";

    animacaoSino = iconeSino.animate(
        [
            { transform: "rotate(0deg)" },
            { transform: "rotate(22deg)" },
            { transform: "rotate(-20deg)" },
            { transform: "rotate(15deg)" },
            { transform: "rotate(-12deg)" },
            { transform: "rotate(8deg)" },
            { transform: "rotate(-5deg)" },
            { transform: "rotate(0deg)" }
        ],
        {
            duration: 900,
            iterations: Infinity,
            easing: "ease-in-out"
        }
    );
}

/**
 * Para a animação do sino quando o usuário clica para ver as notificações
 */
function pararSino() {
    if (animacaoSino) {
        animacaoSino.cancel();
        animacaoSino = null;
    }
}