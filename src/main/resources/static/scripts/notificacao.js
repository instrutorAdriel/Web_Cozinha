/**
 * notificacao.js - Gerenciamento do Painel de Notificações com Dados Reais do Banco (SIGEC)
 */

document.addEventListener("DOMContentLoaded", () => {
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
            const badge = document.getElementById("notif-badge");
            if (badge) badge.hidden = true;
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
    }
}

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
                return;
            }

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

            // Ativa o badge de notificação no sino se houver registros
            const badge = document.getElementById("notif-badge");
            if (badge) badge.hidden = false;
        })
        .catch(erro => {
            console.error("Erro no carregamento das notificações:", erro);
            container.innerHTML = '<p style="padding:15px; color:red; text-align:center; font-size:0.8rem;">Erro ao carregar notificações.</p>';
        });
}