/**
 * notificacoes.js - Gerenciamento do Painel de Notificações (SIGEC)
 */

document.addEventListener("DOMContentLoaded", () => {
  const notifBtn = document.getElementById("notif-btn");
  const notifPanel = document.getElementById("notif-panel");
  const notifList = document.getElementById("notif-list");
  const notifClear = document.getElementById("notif-clear");

  if (!notifBtn || !notifPanel) {
    console.error("Notificação: Elementos #notif-btn ou #notif-panel não foram encontrados no DOM.");
    return;
  }

  // 1. Popula os cards de teste na lista
  if (notifList && notifList.children.length === 0) {
    carregarNotificacoesTeste(notifList);
  }

  // 2. Evento de clique no botão do sino
  notifBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const estaAberto = notifPanel.classList.contains("active") || notifPanel.classList.contains("show");

    if (estaAberto) {
      fecharPainel();
    } else {
      abrirPainel();
    }
  });

  // 3. Previne fechar ao clicar dentro da caixa de notificações
  notifPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 4. Fecha ao clicar fora da caixa na tela
  document.addEventListener("click", () => {
    fecharPainel();
  });

  // 5. Botão "Marcar todas como lidas"
  if (notifClear) {
    notifClear.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const badge = document.getElementById("notif-badge");
      if (badge) badge.hidden = true;
    });
  }

  function abrirPainel() {
    notifPanel.classList.add("active", "show");
    notifBtn.setAttribute("aria-expanded", "true");
  }

  function fecharPainel() {
    notifPanel.classList.remove("active", "show");
    notifBtn.setAttribute("aria-expanded", "false");
  }
});

function carregarNotificacoesTeste(container) {
  const notificacoesFicticias = [
    {
      titulo: "Solicitação de Insumo",
      detalhe: "Farinha de Trigo - 2 KG (Turma 2026.1)",
      tempo: "Há 10 minutos",
      status: "pendente",
      statusTexto: "Pendente"
    },
    {
      titulo: "Solicitação de Utensílio",
      detalhe: "Batedeira Planetária Extra",
      tempo: "Ontem às 14:30",
      status: "negado",
      statusTexto: "Negado"
    },
    {
      titulo: "Solicitação de Insumo",
      detalhe: "Manteiga Sem Sal - 500g",
      tempo: "Há 2 dias",
      status: "aprovado",
      statusTexto: "Aprovado"
    }
  ];

  container.innerHTML = "";

  notificacoesFicticias.forEach((item) => {
    const cardHtml = `
      <div class="notif-item">
        <div class="notif-item-header">
          <strong class="notif-item-title">${item.titulo}</strong>
          <span class="tag-status ${item.status}">${item.statusTexto}</span>
        </div>
        <p class="notif-item-detail">${item.detalhe}</p>
        <small class="notif-item-time">${item.tempo}</small>
      </div>
    `;
    container.innerHTML += cardHtml;
  });

  const badge = document.getElementById("notif-badge");
  if (badge) badge.hidden = false;
}