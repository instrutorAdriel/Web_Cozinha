// ===== Configuração =====
const LIMITE_SCROLL = 10;

// ===== ENTIDADES SEPARADAS =====

const turmas = {
  "2024.1.A": { nome: "Turma 2024.1.A", cozinha: "Padaria Lab 01" },
  "2024.1.C": { nome: "Turma 2024.1.C", cozinha: "Cozinha Pedagógica 02" },
  "2024.2.N": { nome: "Turma 2024.2.N", cozinha: "Cozinha Pedagógica 04" }
};

// Populado via /api/fichas
const receitas = {};

const utensiliosFicha = {};

const estoquePorTurma = {};

const observacoes = {};
let receitaAtual;
let turmaAtual;

const $ = id => document.getElementById(id);

function estoqueDisponivel(tipo, id) {
  const e = estoquePorTurma[turmaAtual];
  if (!e) return 0;
  return (tipo === 'util' ? e.utensilios : e.insumos)?.[id] ?? 0;
}

function statusItem(tipo, item) {
  const disp = estoqueDisponivel(tipo, item.id);
  if (disp >= item.necessario) return { st: 'ok',    label: 'OK',     ok: true  };
  if (disp === 0)              return { st: 'falta', label: 'Falta',  ok: false };
  return { st: 'baixo', label: `Falta ${item.necessario - disp}${item.unidade}`, ok: false };
}

function obsKey(tipo, id) { return `${turmaAtual}|${receitaAtual}|${tipo}|${id}`; }

const painels = {
  main: {
    tipo: 'insumo',
    getItens: () => receitas[receitaAtual]?.itens || [],
    lista: $('checklist-main'),
    name: $('recipe-name'),
    loc: $('recipe-loc'),
    badge: $('turma-badge'),
    pText: $('main-progress-text'),
    pPct: $('main-progress-pct'),
    pBar: $('main-progress-bar'),
    rotulo: 'Checklist da Aula'
  },
  util: {
    tipo: 'util',
    getItens: () => utensiliosFicha[receitaAtual] || [],
    lista: $('util-checklist'),
    name: $('util-recipe-name'),
    loc: $('util-recipe-loc'),
    badge: $('util-turma-badge'),
    pText: $('util-progress-text'),
    pPct: $('util-progress-pct'),
    pBar: $('util-progress-bar'),
    rotulo: 'Lista de utensílios'
  }
};

const select = $('recipe-select');
const turmaSelect = $('turma-select');

async function carregarReceitasDoBanco() {
  try {
    // 1. Faz a requisição para a rota do Controller que criamos no Java
    const resposta = await fetch('/api/fichas/todas');
    const fichasDoBanco = await resposta.json();

    // 2. Limpa as opções e insere uma padrão
    select.innerHTML = '<option value="">-- Selecione uma Receita --</option>';

    // 3. Itera sobre o JSON e cria uma <option> para cada ficha do banco
    fichasDoBanco.forEach(ficha => {
      const optionHtml = `<option value="${ficha.id}">${ficha.nome}</option>`;
      select.innerHTML += optionHtml;
    });

    // 4. Seleciona a primeira receita automaticamente (se existir alguma)
    if (fichasDoBanco.length > 0) {
      const primeiraId = fichasDoBanco[0].id;
      select.value = primeiraId;

      // Chama a função para puxar os detalhes (insumos/utensílios) da primeira receita
      trocarReceita(primeiraId);
    }

  } catch (erro) {
    console.error("Erro ao carregar as receitas do banco:", erro);
    select.innerHTML = '<option value="">Erro ao carregar receitas</option>';
  }
}

// ===== Troca de receita / Detalhes do Banco =====
async function trocarReceita(idDaFicha) {
  if (!idDaFicha) return;

  try {
    const resposta = await fetch(`/api/fichas/${idDaFicha}`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const fichaDoBanco = await resposta.json();

    receitaAtual = idDaFicha;
    if (select) select.value = idDaFicha;
    //  INGREDIENTES
    const listaIngredientes = fichaDoBanco.ingredientes || fichaDoBanco.insumos || [];
    let itensMapeados = (Array.isArray(listaIngredientes) ? listaIngredientes : [])
        .map((rel, i) => {
          if (!rel || typeof rel !== 'object') return null;
          const obj = rel.insumos || rel.insumo || rel.Insumos || rel;
          if (!obj || typeof obj !== 'object') return null;
          const idBase = obj.id ?? rel.id;
          const nome = obj.nome || rel.nome || "Insumo sem nome";
          return {
            id: idBase != null ? String(idBase) : `ins_${i}`,
            nome,
            necessario: rel.quantidade ?? obj.quantidade ?? 0,
            unidade: obj.unidade_medida || obj.unidadeMedida || "un"
          };
        })
        .filter(Boolean);

//  UTENSÍLIOS
    const listaUtensilios = fichaDoBanco.utensilios || [];
    const utensiliosMapeados = (Array.isArray(listaUtensilios) ? listaUtensilios : [])
        .map((rel, i) => {
          if (!rel || typeof rel !== 'object') return null;
          const obj = rel.utensilios || rel.utensilio || rel.Utensilios || rel;
          if (!obj || typeof obj !== 'object') return null;
          const idBase = obj.id ?? rel.id;
          const nome = obj.nome || rel.nome || "Utensílio";
          return {
            id: idBase != null ? String(idBase) : `util_${i}`,
            nome,
            necessario: rel.quantidade ?? 1,
            unidade: "un"
          };
        })
        .filter(Boolean);

    // --- Salva nos objetos globais ---
    receitas[idDaFicha] = {
      nome: fichaDoBanco.nome || "Receita sem nome",
      local: "Cozinha do Banco de Dados",
      tempoPreparo: "--",
      modoPreparo: fichaDoBanco.preparo
          ? String(fichaDoBanco.preparo).split(/\r?\n/).filter(l => l.trim())
          : ["Modo de preparo não informado."],
      itens: itensMapeados
    };
    utensiliosFicha[idDaFicha] = utensiliosMapeados;

    // Garante estrutura de estoque
    if (!estoquePorTurma[turmaAtual]) {
      estoquePorTurma[turmaAtual] = { insumos: {}, utensilios: {} };
    }
    const est = estoquePorTurma[turmaAtual];
    if (!est.insumos) est.insumos = {};
    if (!est.utensilios) est.utensilios = {};

    itensMapeados.forEach(it => {
      if (est.insumos[it.id] == null) est.insumos[it.id] = it.necessario;
    });
    utensiliosMapeados.forEach(ut => {
      if (est.utensilios[ut.id] == null) est.utensilios[ut.id] = ut.necessario;
    });

    renderTudo();
    highlightCard(idDaFicha);
    atualizarResumoReceita(idDaFicha);

    if (window.atualizarNotificacoes) window.atualizarNotificacoes();

  } catch (erro) {
    console.error("Erro ao buscar detalhes da receita:", erro);
    alert("Não foi possível carregar a ficha. Verifique se o servidor está rodando.");
  }
}


function aplicarScrollAdaptativo(container, qtd, rotulo) {
  const ativar = qtd > LIMITE_SCROLL;
  container.classList.toggle('is-scrollable', ativar);
  if (ativar) {
    container.setAttribute('role', 'region');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', `${rotulo}: ${qtd} itens.`);
  } else {
    container.removeAttribute('role');
    container.removeAttribute('tabindex');
    container.removeAttribute('aria-label');
  }
}

function updateProgress(p) {
  const checkboxes = p.lista.querySelectorAll('input[type="checkbox"]');
  const total = checkboxes.length;
  const done = p.lista.querySelectorAll('input[type="checkbox"]:checked').length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  if (p.pText) p.pText.textContent = `${done} de ${total} itens marcados`;
  if (p.pPct)  p.pPct.textContent  = pct;
  if (p.pBar)  p.pBar.style.width  = pct + '%';
}

function renderPainel(p) {
  const receita = receitas[receitaAtual];
  const turma = turmas[turmaAtual];

  if (!receita || !turma) return;

  if (p.name) p.name.textContent = receita.nome;
  if (p.loc) p.loc.textContent  = receita.local;
  if (p.badge) p.badge.textContent = `${turma.nome} • ${turma.cozinha}`;

  const itens = p.getItens();
  p.lista.innerHTML = itens.map((it) => {
    const disp = estoqueDisponivel(p.tipo, it.id);
    const s = statusItem(p.tipo, it);
    const obs = observacoes[obsKey(p.tipo, it.id)];

    let tagHtml = `<span class="estoque-tag ${s.st}">${s.label}</span>`;
    let disabledAttr = '';

    if (it.pendente) {
      tagHtml = `<span class="estoque-tag baixo" style="background:#fff3cd; color:#856404; border-color:#ffeeba;">Pendente Aprovação</span>`;
      disabledAttr = `disabled`;
    }

    const clsEstoque = it.pendente ? 'estoque-baixo' : (s.st === 'ok' ? '' : (s.st === 'falta' ? 'estoque-falta' : 'estoque-baixo'));

    return `
      <label class="check-item ${obs ? 'has-obs' : ''} ${clsEstoque}">
        <input type="checkbox" data-id="${it.id}" ${disabledAttr}>
        <span class="check-box"><span class="material-symbols-outlined">check</span></span>
        <span class="check-label">${it.nome}</span>
        <span class="obs-flag" data-obs="${it.id}" title="${obs || 'Adicionar observação'}"><span class="material-symbols-outlined">sticky_note_2</span></span>
        ${tagHtml}
        <span class="check-qty">${it.pendente ? '?' : disp}/${it.necessario}${it.unidade}</span>
      </label>`;
  }).join('');

  updateProgress(p);
  aplicarScrollAdaptativo(p.lista, itens.length, p.rotulo);
}

function renderTudo() {
  renderPainel(painels.main);
  renderPainel(painels.util);
}

function configurarPainel(p, btnResetId) {
  p.lista.addEventListener('click', e => {
    const flag = e.target.closest('.obs-flag');
    if (flag) {
      e.preventDefault();
      abrirObs(p.tipo, flag.dataset.obs);
    }
  });

  p.lista.addEventListener('change', e => {
    if (e.target.type === 'checkbox') updateProgress(p);
  });

  if (btnResetId && $(btnResetId)) {
    $(btnResetId).addEventListener('click', () => {
      const checkboxes = p.lista.querySelectorAll('input[type="checkbox"]:not(:disabled)');
      checkboxes.forEach(cb => cb.checked = false);
      updateProgress(p);
    });
  }
}

configurarPainel(painels.main, 'main-btn-reset');
configurarPainel(painels.util, 'util-btn-reset');

// ===== RESUMO E MODO COZINHA =====
const summaryName = $('summary-recipe-name');
const summarySteps = $('summary-steps');
const summaryFooter = $('summary-footer'); 
const summaryTime = $('summary-time');
const kitchenModal = $('kitchen-modal');
const kitchenTitle = $('kitchen-title');
const kitchenSteps = $('kitchen-steps');

function atualizarResumoReceita(key) {
  const r = receitas[key];
  if (!r) return;

  if(summaryName) summaryName.textContent = r.nome;
  
  if(summarySteps) {
    if (r.modoPreparo && r.modoPreparo.length > 0) {
      summarySteps.innerHTML = r.modoPreparo.map(passo => `<li>${passo}</li>`).join('');
    } else {
      summarySteps.innerHTML = `<li style="list-style: none;">Modo de preparo indisponível para esta ficha.</li>`;
    }
  }

  if(summaryFooter && summaryTime) {
    if (r.tempoPreparo && r.modoPreparo && r.modoPreparo.length > 0) {
      summaryTime.textContent = r.tempoPreparo;
      summaryFooter.style.display = 'flex';
    } else {
      summaryFooter.style.display = 'none';
    }
  }
}

function abrirModoCozinha() {
  const r = receitas[receitaAtual];
  if (!r) return;

  if(kitchenTitle) kitchenTitle.textContent = r.nome;
  
  if(kitchenSteps) {
    if (r.modoPreparo && r.modoPreparo.length > 0) {
      kitchenSteps.innerHTML = r.modoPreparo.map(passo => `<li>${passo}</li>`).join('');
    } else {
      kitchenSteps.innerHTML = `<li>Modo de preparo indisponível.</li>`;
    }
  }
  
  if(kitchenModal) kitchenModal.classList.add('show');
}

const btnOpenKitchen = $('btn-open-kitchen');
if(btnOpenKitchen) btnOpenKitchen.addEventListener('click', abrirModoCozinha);

function fecharModalCozinha() { 
  if(kitchenModal) kitchenModal.classList.remove('show'); 
}

const kitchenClose = $('kitchen-close');
if(kitchenClose) {
  kitchenClose.addEventListener('click', (e) => {
    e.stopPropagation();
    fecharModalCozinha();
  });
}

if(kitchenModal) {
  kitchenModal.addEventListener('click', e => { 
    if (e.target === kitchenModal) fecharModalCozinha(); 
  });
}

// ===== MODAIS EXTRAS E CONCLUSÃO DE AULA =====
const extraModal = $('extra-modal');
if($('btn-add-insumo')) {
  $('btn-add-insumo').addEventListener('click', () => {
    $('extra-name').value = ''; $('extra-qtd').value = ''; $('extra-un').value = ''; $('extra-obs').value = '';
    extraModal.classList.add('show'); $('extra-name').focus();
  });
}
function fecharModalExtra() { extraModal.classList.remove('show'); }
$('extra-close').addEventListener('click', fecharModalExtra);
$('extra-cancel').addEventListener('click', fecharModalExtra);
extraModal.addEventListener('click', e => { if (e.target === extraModal) fecharModalExtra(); });

$('extra-save').addEventListener('click', () => {
  const nome = $('extra-name').value.trim();
  if (!nome) return alert("Por favor, insira o nome do insumo.");
  const necessario = parseFloat($('extra-qtd').value) || 0;
  const unidade = $('extra-un').value.trim() || 'un';
  const obs = $('extra-obs').value.trim();
  const id = 'item_extra_' + Date.now();

  painels.main.getItens().push({ id, nome, necessario, unidade, pendente: true });
  const e = estoquePorTurma[turmaAtual];
  e.insumos[id] = 0;
  if (obs) observacoes[obsKey('insumo', id)] = obs;

  renderPainel(painels.main);
  fecharModalExtra();
  if (window.atualizarNotificacoes) window.atualizarNotificacoes();
  alert(`A solicitação urgente para "${nome}" foi enviada para o Desktop de Gestão.`);
});

const utilModal = $('util-modal');
if($('btn-add-util')) {
  $('btn-add-util').addEventListener('click', () => {
    $('util-name').value = ''; $('util-qtd').value = ''; $('util-obs').value = '';
    utilModal.classList.add('show'); $('util-name').focus();
  });
}
function fecharModalUtil() { utilModal.classList.remove('show'); }
$('util-close').addEventListener('click', fecharModalUtil);
$('util-cancel').addEventListener('click', fecharModalUtil);
utilModal.addEventListener('click', e => { if (e.target === utilModal) fecharModalUtil(); });

$('util-save').addEventListener('click', () => {
  const nome = $('util-name').value.trim();
  if (!nome) return alert("Por favor, insira o nome do utensílio.");
  const necessario = parseFloat($('util-qtd').value) || 0;
  const obs = $('util-obs').value.trim();
  const id = 'item_util_' + Date.now();

  (utensiliosFicha[receitaAtual] = utensiliosFicha[receitaAtual] || []);
  painels.util.getItens().push({ id, nome, necessario, unidade: 'un', pendente: true });
  const e = estoquePorTurma[turmaAtual];
  e.utensilios[id] = 0;
  if (obs) observacoes[obsKey('util', id)] = obs;

  renderPainel(painels.util);
  fecharModalUtil();
  if (window.atualizarNotificacoes) window.atualizarNotificacoes();
  alert(`A solicitação de empréstimo para o utensílio "${nome}" foi enviada.`);
});


// MODAIS DE CONCLUSÃO (Insumos e Utensílios)

// 1. Modal de Insumos
const finishModalInsumos = $('finish-modal_insumos');
// Precisamos garantir que o botão no HTML que abre isso tenha o id "btn-finish-insumos"
const btnFinishInsumos = $('btn-finish-insumos');

if (btnFinishInsumos && finishModalInsumos) {
  btnFinishInsumos.addEventListener('click', () => {
    $('finish-obs_insumos').value = '';
    finishModalInsumos.classList.add('show');
    $('finish-obs_insumos').focus();
  });
}

function fecharModalFinishInsumos() { if(finishModalInsumos) finishModalInsumos.classList.remove('show'); }
if($('finish-close_insumos')) $('finish-close_insumos').addEventListener('click', fecharModalFinishInsumos);
if($('finish-cancel_insumos')) $('finish-cancel_insumos').addEventListener('click', fecharModalFinishInsumos);
if(finishModalInsumos) {
  finishModalInsumos.addEventListener('click', e => { if (e.target === finishModalInsumos) fecharModalFinishInsumos(); });
}

if($('finish-save_insumos')) {
  $('finish-save_insumos').addEventListener('click', () => {
    const obsGeral = $('finish-obs_insumos').value.trim();
    if (obsGeral) observacoes[`${turmaAtual}|${receitaAtual}|relato_insumos`] = obsGeral;
    fecharModalFinishInsumos();
    alert('Verificação de Insumos finalizada com sucesso!');
  });
}

// 2. Modal de Utensílios
const finishModalUtensilios = $('finish-modal_utensilios');
const btnFinishUtensilios = $('btn-finish-utensilios');

if (btnFinishUtensilios && finishModalUtensilios) {
  btnFinishUtensilios.addEventListener('click', () => {
    $('finish-obs_utensilios').value = '';
    finishModalUtensilios.classList.add('show');
    $('finish-obs_utensilios').focus();
  });
}

function fecharModalFinishUtensilios() { if(finishModalUtensilios) finishModalUtensilios.classList.remove('show'); }
if($('finish-close_utensilios')) $('finish-close_utensilios').addEventListener('click', fecharModalFinishUtensilios);
if($('finish-cancel_utensilios')) $('finish-cancel_utensilios').addEventListener('click', fecharModalFinishUtensilios);
if(finishModalUtensilios) {
  finishModalUtensilios.addEventListener('click', e => { if (e.target === finishModalUtensilios) fecharModalFinishUtensilios(); });
}

if($('finish-save_utensilios')) {
  $('finish-save_utensilios').addEventListener('click', () => {
    const obsGeral = $('finish-obs_utensilios').value.trim();
    if (obsGeral) observacoes[`${turmaAtual}|${receitaAtual}|relato_utensilios`] = obsGeral;
    fecharModalFinishUtensilios();
    alert('Verificação de Utensílios finalizada com sucesso!');
  });
}

// REAPROVEITAMENTO DE SOBRAS
const sobrasModal = $('sobras-modal');

if ($('btn-sobras')) {
  $('btn-sobras').addEventListener('click', () => {
    $('sobras-name').value = '';
    const listaSobras = $('sobras-list');

    const itensAtuais = painels.main.getItens();

    if (itensAtuais.length === 0) {
      return alert("Não há itens nesta receita para gerar sobras.");
    }

    listaSobras.innerHTML = itensAtuais.map(it => `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; flex: 1;">
          <input type="checkbox" class="sobra-check" data-id="${it.id}" data-nome="${it.nome}" data-un="${it.unidade}">
          <span style="font-size: 14px; font-weight: 500; color: #1e293b;">${it.nome}</span>
        </label>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" id="sobra-qtd-${it.id}" class="obs-textarea" style="width: 80px; min-height: 30px; height: 30px; padding: 4px 8px; margin: 0;" placeholder="0" disabled>
          <span style="font-size: 12px; color: #64748b; width: 20px; text-align: left;">${it.unidade}</span>
        </div>
      </div>
    `).join('');

    listaSobras.querySelectorAll('.sobra-check').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const inputQtd = $(`sobra-qtd-${e.target.dataset.id}`);
        inputQtd.disabled = !e.target.checked;
        if (e.target.checked) inputQtd.focus();
        else inputQtd.value = '';
      });
    });

    sobrasModal.classList.add('show');
  });
}

function fecharModalSobras() { sobrasModal.classList.remove('show'); }
if ($('sobras-close')) $('sobras-close').addEventListener('click', fecharModalSobras);
if ($('sobras-cancel')) $('sobras-cancel').addEventListener('click', fecharModalSobras);
if (sobrasModal) sobrasModal.addEventListener('click', e => { if (e.target === sobrasModal) fecharModalSobras(); });

if ($('sobras-save')) {
  $('sobras-save').addEventListener('click', () => {
    const nomeNovaFicha = $('sobras-name').value.trim();
    if (!nomeNovaFicha) return alert("Por favor, digite um nome para a nova ficha.");

    const checksMarcados = document.querySelectorAll('.sobra-check:checked');
    if (checksMarcados.length === 0) return alert("Selecione pelo menos um insumo que sobrou.");

    const novosItens = [];
    let erroQuantidade = false;

    checksMarcados.forEach(cb => {
      const id = cb.dataset.id;
      const nome = cb.dataset.nome;
      const un = cb.dataset.un;
      const qtdDigitada = parseFloat($(`sobra-qtd-${id}`).value);

      if (isNaN(qtdDigitada) || qtdDigitada <= 0) {
        erroQuantidade = true;
      } else {
        novosItens.push({ id, nome, necessario: qtdDigitada, unidade: un });
      }
    });

    if (erroQuantidade) {
      return alert("Por favor, informe uma quantidade válida (maior que zero) para todos os itens selecionados.");
    }

    const novaId = 'criativa_' + Date.now();
    receitas[novaId] = {
      nome: `🌟 Criativa: ${nomeNovaFicha}`,
      local: `Sobras • ${turmas[turmaAtual].cozinha}`,
      tempoPreparo: "--",
      modoPreparo: ["Aula criativa a partir de sobras."],
      itens: novosItens
    };
    utensiliosFicha[novaId] = [];
    // Adiciona no select e seleciona (sem fetch — ficha 100% local)
    select.innerHTML += `<option value="${novaId}">${receitas[novaId].nome}</option>`;
    receitaAtual = novaId;
    select.value = novaId;
    renderTudo();
    atualizarResumoReceita(novaId);
    if (window.atualizarNotificacoes) window.atualizarNotificacoes();

    fecharModalSobras();
    alert(`Aula criativa criada com sucesso!\nForam reaproveitados ${novosItens.length} itens.`);
  });
}


function trocarTurma(key) {
  // Verifica se a turma existe, se não, define um padrão
  if (!turmas[key]) key = '2024.1.A';

  turmaAtual = key;
  if (turmaSelect) turmaSelect.value = key;

  if (receitaAtual) {
    renderTudo();
    highlightCard(receitaAtual);
  }
}

select.addEventListener('change', e => trocarReceita(e.target.value));
turmaSelect.addEventListener('change', e => trocarTurma(e.target.value));

turmaSelect.innerHTML = Object.entries(turmas)
  .map(([k, t]) => `<option value="${k}">${t.nome} — ${t.cozinha}</option>`).join('');

document.querySelectorAll('.class-card').forEach(card => {
  const recipeKey = card.dataset.recipe;
  const turmaKey  = card.dataset.turma;
  const link = card.querySelector('.recipe-link');
  if (link && recipeKey) {
    link.addEventListener('click', () => {
      if (turmaKey && turmas[turmaKey]) trocarTurma(turmaKey);
      trocarReceita(recipeKey);

    });
  }
});

function highlightCard(key) {
  document.querySelectorAll('.class-card').forEach(c =>
    c.classList.toggle('selected', c.dataset.recipe === key)
  );
}

// Menu Mobile
const menuBtn = $('menu-toggle');
const sidebar = $('sidebar');
const overlay = $('overlay');

function toggleSidebar(open) {
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
}
menuBtn?.addEventListener('click', () => toggleSidebar(!sidebar.classList.contains('open')));
overlay?.addEventListener('click', () => toggleSidebar(false));

// Modal de observação
const obsModal = $('obs-modal');
const obsName  = $('obs-item-name');
const obsText  = $('obs-text');
let obsIdAtual   = null;
let obsTipoAtual = null;

function abrirObs(tipo, id) {
  obsTipoAtual = tipo; obsIdAtual   = id;
  const panel = painels[tipo] || painels.main;
  const item = panel.getItens().find(i => i.id === id);
  obsName.textContent = item ? item.nome : '';
  obsText.value = observacoes[obsKey(tipo, id)] || '';
  obsModal.classList.add('show');
  obsText.focus();
}

function fecharObs() {
  obsModal.classList.remove('show');
  obsIdAtual = null; obsTipoAtual = null;
}

$('obs-save').addEventListener('click', () => {
  if (obsIdAtual && obsTipoAtual) {
    observacoes[obsKey(obsTipoAtual, obsIdAtual)] = obsText.value.trim();
    renderPainel(painels[obsTipoAtual]);
  }
  fecharObs();
});

$('obs-close').addEventListener('click', fecharObs);
$('obs-cancel').addEventListener('click', fecharObs);
obsModal.addEventListener('click', e => { if (e.target === obsModal) fecharObs(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharObs(); });

// ===== Inicialização =====
turmaAtual = '2024.1.A';
if (turmaSelect) {
  turmaSelect.value = turmaAtual;
}
// Dispara o carregamento das receitas vindas do banco de dados MySQL
carregarReceitasDoBanco();

// ===== NOTIFICAÇÕES (baseadas na receita atual carregada) =====
(function () {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  const clear = document.getElementById('notif-clear');
  if (!btn || !panel) return;

  function gerarNotificacoes() {
    const notifs = [];
    const lidas = JSON.parse(localStorage.getItem('sigec-notif-lidas') || '[]');

    const receita = receitas[receitaAtual];
    const est = estoquePorTurma[turmaAtual];
    if (!receita || !est) return [];

    (receita.itens || []).forEach(item => {
      const id = `${turmaAtual}-${receitaAtual}-insumo-${item.id}`;
      if (item.pendente) {
        notifs.push({ id, tipo: 'info', titulo: 'Aprovação Pendente', texto: `Aguardando liberação do insumo extra: ${item.nome}.` });
      } else {
        const disp = est.insumos?.[item.id] ?? 0;
        if (disp === 0) {
          notifs.push({ id, tipo: 'err', titulo: `Sem estoque: ${item.nome}`, texto: `${turmas[turmaAtual].nome} • ${receita.nome} — falta tudo (${item.necessario}${item.unidade}).` });
        } else if (disp < item.necessario) {
          notifs.push({ id, tipo: 'warn', titulo: `Estoque baixo: ${item.nome}`, texto: `${turmas[turmaAtual].nome} • falta ${item.necessario - disp}${item.unidade} de ${item.nome}.` });
        }
      }
    });

    (utensiliosFicha[receitaAtual] || []).forEach(item => {
      if (item.pendente) {
        notifs.push({ id: `${turmaAtual}-${receitaAtual}-util-${item.id}`, tipo: 'info', titulo: 'Aprovação Pendente', texto: `Aguardando liberação do utensílio extra: ${item.nome}.` });
      }
    });

    return notifs.map(n => ({ ...n, lida: lidas.includes(n.id) }));
  }

  function render() {
    const notifs = gerarNotificacoes();
    badge.hidden = notifs.filter(n => !n.lida).length === 0;

    if (!notifs.length) {
      list.innerHTML = `<p class="notif-empty">🎉 Tudo certo! Nenhuma pendência.</p>`;
      return;
    }
    const icone = { err: 'error', warn: 'warning', info: 'schedule' };
    list.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.lida ? '' : 'unread'}">
        <span class="notif-icon ${n.tipo}"><span class="material-symbols-outlined">${icone[n.tipo]}</span></span>
        <div class="notif-body">
          <p class="notif-title">${n.titulo}</p>
          <p class="notif-text">${n.texto}</p>
        </div>
      </div>`).join('');
  }

  window.atualizarNotificacoes = render;

  function marcarTodasLidas() {
    localStorage.setItem('sigec-notif-lidas', JSON.stringify(gerarNotificacoes().map(n => n.id)));
    render();
  }
  function toggle(open) {
    const abrir = open ?? !panel.classList.contains('show');
    panel.classList.toggle('show', abrir);
    btn.setAttribute('aria-expanded', abrir);
    if (abrir) render();
  }
  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
  clear.addEventListener('click', marcarTodasLidas);
  document.addEventListener('click', e => { if (!panel.contains(e.target) && !btn.contains(e.target)) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  render();
})();

// ===== SAUDAÇÃO =====
function atualizarSaudacao() {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const el = document.getElementById("mensagem-tempo");
  if (el) el.innerText = saudacao;
}
document.addEventListener("DOMContentLoaded", atualizarSaudacao);