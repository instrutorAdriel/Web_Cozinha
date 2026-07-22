// ===== Configuração =====
const LIMITE_SCROLL = 10;

// ===== ENTIDADES SEPARADAS =====

const turmas = {
  "2024.1.A": { nome: "Turma 2024.1.A", cozinha: "Padaria Lab 01" },
  "2024.1.C": { nome: "Turma 2024.1.C", cozinha: "Cozinha Pedagógica 02" },
  "2024.2.N": { nome: "Turma 2024.2.N", cozinha: "Cozinha Pedagógica 04" }
};

// RECEITAS ENRIQUECIDAS COM DESCRIÇÃO E MODO DE PREPARO
const receitas = {
  confeitaria_bolo: {
    nome: "Bolo de Cenoura com Cobertura",
    local: "08:00 • Cozinha Pedagógica 02",
    descricao: "Massa fofa de cenoura com cobertura clássica de chocolate em pó 50%, focada em técnicas de emulsão.",
    tempoPreparo: "45 min",
    modoPreparo: [
      "Pré-aqueça o forno a 180°C e unte as 6 formas.",
      "No liquidificador, bata as cenouras, os ovos e o óleo até obter um creme liso.",
      "Em uma tigela inox, misture a farinha e o açúcar. Despeje o creme de cenoura e incorpore com a espátula.",
      "Adicione o fermento e misture delicadamente. Distribua nas formas e asse por 35 minutos.",
      "Para a cobertura: misture o chocolate, açúcar e manteiga e leve ao fogo até desgrudar do fundo."
    ],
    itens: [
      { id: "cenoura", nome: "Cenoura Fresca",      necessario: 500,  unidade: "g" },
      { id: "farinha", nome: "Farinha de Trigo",    necessario: 2000, unidade: "g" },
      { id: "acucar",  nome: "Açúcar Refinado",     necessario: 1000, unidade: "g" },
      { id: "ovos",    nome: "Ovos",                necessario: 12,   unidade: "un" },
      { id: "choco",   nome: "Chocolate em Pó 50%", necessario: 300,  unidade: "g" },
      { id: "formas",  nome: "Formas de Bolo",      necessario: 6,    unidade: "un" }
    ]
  },
  confeitaria_torta: {
    nome: "Torta de Maçã Caramelada",
    local: "10:00 • Cozinha Pedagógica 02",
    descricao: "Clássica torta doce com massa brisée e recheio de maçãs caramelizadas, com foco em ponto de massa quebradiça.",
    tempoPreparo: "1h 30min",
    modoPreparo: [
      "Prepare a massa brisée misturando farinha e manteiga gelada com as pontas dos dedos.",
      "Adicione água gelada aos poucos até dar ponto. Leve à geladeira por 30 minutos.",
      "Descasque e corte as maçãs. Caramelize o açúcar e cozinhe as maçãs brevemente.",
      "Abra a massa e forre as formas. Adicione o recheio já frio.",
      "Asse a 180°C até a massa dourar e o recheio borbulhar."
    ],
    itens: [
      { id: "farinha",  nome: "Farinha de Trigo", necessario: 1500, unidade: "g" },
      { id: "manteiga", nome: "Manteiga",         necessario: 500,  unidade: "g" },
      { id: "acucar",   nome: "Açúcar Refinado",  necessario: 600,  unidade: "g" },
      { id: "ovos",     nome: "Ovos",             necessario: 4,    unidade: "un" },
      { id: "maca",     nome: "Maçã Verde",       necessario: 1500, unidade: "g" }
    ]
  },
  panificacao_pao: {
    nome: "Pão Francês & Baguete",
    local: "13:30 • Padaria Lab 01",
    descricao: "Clássico pão de casca crocante e miolo super macio. Foco em sova, fermentação e corte (pestana).",
    tempoPreparo: "3h 30min",
    modoPreparo: [
      "Misture a farinha tipo 1, o sal e o melhorador na masseira.",
      "Adicione 80% da água gelada e inicie a mistura na velocidade baixa (1ª marcha).",
      "Quando a massa homogeneizar, adicione o fermento fresco e o restante da água. Passe para a 2ª marcha até o ponto de véu.",
      "Divida a massa, boleie e deixe descansar nas cestas de fermentação.",
      "Faça os cortes (grigne) com a lâmina e asse em forno de lastro a 200°C com vapor inicial."
    ],
    itens: [
      { id: "farinha_t1", nome: "Farinha de Trigo Tipo 1",   necessario: 5000, unidade: "g" },
      { id: "fermento",   nome: "Fermento Biológico Fresco", necessario: 250,  unidade: "g" },
      { id: "sal",        nome: "Sal Refinado",              necessario: 100,  unidade: "g" },
      { id: "melhorador", nome: "Melhorador de Farinha",     necessario: 50,   unidade: "g" },
      { id: "agua",       nome: "Água Filtrada",             necessario: 3000, unidade: "ml" },
      { id: "assadeiras", nome: "Formas / Assadeiras",       necessario: 6,    unidade: "un" }
    ]
  },
  panificacao_brioche: {
    nome: "Brioche Amanteigado",
    local: "15:30 • Padaria Lab 01",
    descricao: "Pão francês de luxo, altamente enriquecido com manteiga e ovos, resultando em um miolo amarelo e desfiável.",
    tempoPreparo: "4h",
    modoPreparo: [
      "Na masseira, coloque a farinha, o fermento e o açúcar.",
      "Adicione os ovos aos poucos na velocidade baixa até formar uma massa consistente.",
      "Quando atingir 50% de desenvolvimento do glúten, adicione a manteiga gelada em cubos pequenos progressivamente.",
      "Bata até o ponto de véu perfeito e brilhante.",
      "Deixe fermentar, modele nas formas específicas e asse a 180°C."
    ],
    itens: [
      { id: "farinha_t1", nome: "Farinha de Trigo Tipo 1",   necessario: 2000, unidade: "g" },
      { id: "fermento",   nome: "Fermento Biológico Fresco", necessario: 100,  unidade: "g" },
      { id: "manteiga_p", nome: "Manteiga Premium",          necessario: 800,  unidade: "g" },
      { id: "ovos_p",     nome: "Ovos",                      necessario: 10,   unidade: "un" },
      { id: "acucar_p",   nome: "Açúcar Refinado",           necessario: 400,  unidade: "g" }
    ]
  },
  asia_yakisoba: {
    nome: "Yakisoba & Tempurá de Legumes",
    local: "19:00 • Cozinha Pedagógica 04",
    descricao: "Preparo tradicional asiático que combina a técnica do stir-fry no wok para o yakisoba e a fritura de imersão leve para o tempurá.",
    tempoPreparo: "40 min",
    modoPreparo: [
      "Prepare a massa do tempurá com água extremamente gelada e mantenha sob refrigeração.",
      "Corte os legumes para o tempurá e para o yakisoba.",
      "Aqueça bem o wok, adicione óleo e sele as carnes (se houver). Reserve.",
      "No mesmo wok, refogue os legumes firmes, adicione o macarrão pré-cozido e o molho shoyu. Finalize com óleo de gergelim.",
      "Mergulhe os legumes do tempurá na massa e frite em óleo quente até a casca ficar crocante e clara."
    ],
    itens: [
      { id: "macarrao", nome: "Macarrão para Yakisoba", necessario: 2000, unidade: "g" },
      { id: "shoyu",    nome: "Molho Shoyu",            necessario: 1000, unidade: "ml" },
      { id: "gengibre", nome: "Gengibre Fresco",        necessario: 200,  unidade: "g" },
      { id: "legumes",  nome: "Legumes Variados",       necessario: 3000, unidade: "g" },
      { id: "oleo",     nome: "Óleo para Fritura",      necessario: 5000, unidade: "ml" },
      { id: "tempura",  nome: "Farinha Tempurá",        necessario: 1000, unidade: "g" }
    ]
  },
  asia_sushi: {
    nome: "Sushi & Sashimi Tradicional",
    local: "20:30 • Cozinha Pedagógica 04",
    descricao: "Técnicas de corte de peixes para sashimi e preparo do shari (arroz de sushi) temperado com su para montagem de makis.",
    tempoPreparo: "2h",
    modoPreparo: [
      "Lave o arroz repetidas vezes até a água sair cristalina. Cozinhe com a proporção exata de água.",
      "Misture o vinagre, açúcar e sal para fazer o 'su'. Tempere o arroz quente e resfrie rapidamente.",
      "Prepare os cortes de salmão utilizando a faca yanagiba (cortes limpos, sem serrar).",
      "Posicione a alga nori sobre a esteira, espalhe o arroz, recheie e enrole com firmeza.",
      "Corte os rolos e sirva imediatamente com shoyu e gengibre em conserva."
    ],
    itens: [
      { id: "arroz",    nome: "Arroz para Sushi", necessario: 1500, unidade: "g" },
      { id: "shoyu",    nome: "Molho Shoyu",      necessario: 500,  unidade: "ml" },
      { id: "gengibre", nome: "Gengibre Fresco",  necessario: 150,  unidade: "g" },
      { id: "salmao",   nome: "Salmão Fresco",    necessario: 1000, unidade: "g" },
      { id: "alga",     nome: "Alga Nori",        necessario: 100,  unidade: "un" }
    ]
  }
};

const receitasPorTurma = {
  "2024.1.A": ["panificacao_pao", "panificacao_brioche"],
  "2024.1.C": ["confeitaria_bolo", "confeitaria_torta"],
  "2024.2.N": ["asia_yakisoba", "asia_sushi"]
};

const utensiliosFicha = {
  confeitaria_bolo: [
    { id: "batedeira", nome: "Batedeira Planetária", necessario: 1, unidade: "un" },
    { id: "tigelas",   nome: "Tigelas Inox",         necessario: 4, unidade: "un" },
    { id: "espatula",  nome: "Espátula de Silicone", necessario: 3, unidade: "un" },
    { id: "balanca",   nome: "Balança Digital",      necessario: 1, unidade: "un" }
  ],
  confeitaria_torta: [
    { id: "rolo",     nome: "Rolo de Massa",        necessario: 2, unidade: "un" },
    { id: "formas_t", nome: "Formas de Torta",      necessario: 4, unidade: "un" },
    { id: "balanca",  nome: "Balança Digital",      necessario: 1, unidade: "un" }
  ],
  panificacao_pao: [
    { id: "masseira", nome: "Masseira / Amassadeira",   necessario: 1, unidade: "un" },
    { id: "forno",    nome: "Forno de Lastro",          necessario: 1, unidade: "un" },
    { id: "cestas",   nome: "Cestas de Fermentação",    necessario: 8, unidade: "un" },
    { id: "lamina",   nome: "Lâmina de Corte (grigne)", necessario: 2, unidade: "un" }
  ],
  panificacao_brioche: [
    { id: "masseira", nome: "Masseira / Amassadeira", necessario: 1, unidade: "un" },
    { id: "forno",    nome: "Forno de Lastro",        necessario: 1, unidade: "un" },
    { id: "formas_b", nome: "Formas de Brioche",      necessario: 6, unidade: "un" }
  ],
  asia_yakisoba: [
    { id: "wok",        nome: "Wok",             necessario: 2, unidade: "un" },
    { id: "fritadeira", nome: "Fritadeira",      necessario: 1, unidade: "un" },
    { id: "escumadeira",nome: "Escumadeira",     necessario: 2, unidade: "un" },
    { id: "tabuas",     nome: "Tábuas de Corte", necessario: 4, unidade: "un" }
  ],
  asia_sushi: [
    { id: "esteira",  nome: "Esteira de Bambu",  necessario: 4, unidade: "un" },
    { id: "faca_s",   nome: "Faca Yanagiba",     necessario: 2, unidade: "un" },
    { id: "tabuas",   nome: "Tábuas de Corte",   necessario: 4, unidade: "un" }
  ]
};

const estoquePorTurma = {
  "2024.1.A": {
    insumos: { farinha_t1: 8000, fermento: 400, sal: 200, melhorador: 80, agua: 6000, assadeiras: 6, manteiga_p: 1000, ovos_p: 24, acucar_p: 600 },
    utensilios: { masseira: 1, forno: 1, cestas: 8, lamina: 2, formas_b: 6 }
  },
  "2024.1.C": {
    insumos: { cenoura: 800, farinha: 4000, acucar: 2000, ovos: 24, choco: 500, formas: 6, manteiga: 700, maca: 2000 },
    utensilios: { batedeira: 1, tigelas: 4, espatula: 3, balanca: 1, rolo: 2, formas_t: 4 }
  },
  "2024.2.N": {
    insumos: { macarrao: 3000, shoyu: 2000, gengibre: 500, legumes: 4000, oleo: 8000, tempura: 1500, arroz: 2500, salmao: 1500, alga: 200 },
    utensilios: { wok: 2, fritadeira: 1, escumadeira: 2, tabuas: 4, esteira: 4, faca_s: 2 }
  }
};

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
    getItens: () => receitas[receitaAtual].itens,
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

// === MODAIS DE CONCLUSÃO (Insumos e Utensílios) ===

// 1. Modal de Insumos
const finishModalInsumos = $('finish-modal_insumos');
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

// ===== REAPROVEITAMENTO DE SOBRAS (RF07) =====
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
      itens: novosItens
    };

    receitasPorTurma[turmaAtual].push(novaId);
    popularReceitasDaTurma(turmaAtual);
    trocarReceita(novaId);

    fecharModalSobras();
    alert(`Aula criativa criada com sucesso!\nForam reaproveitados ${novosItens.length} itens com as quantidades ajustadas.`);
  });
}

// ===== Troca de receita / turma =====
function trocarReceita(key) {
  const permitidas = receitasPorTurma[turmaAtual] || Object.keys(receitas);
  if (!receitas[key] || !permitidas.includes(key)) key = permitidas[0];
  receitaAtual = key;
  if (select) select.value = key;
  renderTudo();
  highlightCard(key);
  atualizarResumoReceita(key);
}

function popularReceitasDaTurma(turmaKey) {
  const permitidas = receitasPorTurma[turmaKey] || Object.keys(receitas);
  select.innerHTML = permitidas
      .map(id => `<option value="${id}">${receitas[id].local} • ${receitas[id].nome}</option>`)
      .join('');
}

function trocarTurma(key) {
  if (!turmas[key]) key = '2024.1.A';
  turmaAtual = key;
  if (turmaSelect) turmaSelect.value = key;

  popularReceitasDaTurma(key);
  const permitidas = receitasPorTurma[key] || Object.keys(receitas);
  if (!permitidas.includes(receitaAtual)) receitaAtual = permitidas[0];
  select.value = receitaAtual;

  renderTudo();
  highlightCard(receitaAtual);
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
turmaAtual   = '2024.1.A';
turmaSelect.value = turmaAtual;
popularReceitasDaTurma(turmaAtual);
receitaAtual = (receitasPorTurma[turmaAtual] || Object.keys(receitas))[0];
select.value = receitaAtual;

renderTudo();
highlightCard(receitaAtual);
atualizarResumoReceita(receitaAtual);

// ===== NOTIFICAÇÕES =====
(function () {
  const btn    = document.getElementById('notif-btn');
  const panel  = document.getElementById('notif-panel');
  const list   = document.getElementById('notif-list');
  const badge  = document.getElementById('notif-badge');
  const clear  = document.getElementById('notif-clear');
  if (!btn || !panel) return;

  function fichaTurmaMap() {
    const map = {};
    Object.entries(receitasPorTurma).forEach(([turmaId, fichas]) => {
      fichas.forEach(f => map[f] = turmaId);
    });
    return map;
  }

  function gerarNotificacoes() {
    const notifs = [];
    const lidas = JSON.parse(localStorage.getItem('sigec-notif-lidas') || '[]');
    const fichaTurma = fichaTurmaMap();

    Object.entries(receitas).forEach(([fichaId, receita]) => {
      const turmaId = fichaTurma[fichaId];
      if (!turmaId) return;
      const est = estoquePorTurma[turmaId];
      if (!est) return;

      receita.itens.forEach(item => {
        const id = `${turmaId}-${fichaId}-insumo-${item.id}`;
        if (item.pendente) {
          notifs.push({
            id, tipo: 'info',
            titulo: `Aprovação Pendente`,
            texto: `Aguardando liberação do insumo extra: ${item.nome}.`
          });
        } else {
          const disp = est.insumos?.[item.id] ?? 0;
          if (disp === 0) {
            notifs.push({
              id, tipo: 'err',
              titulo: `Sem estoque: ${item.nome}`,
              texto: `${turmas[turmaId].nome} • ${receita.nome} — falta tudo (${item.necessario}${item.unidade}).`
            });
          } else if (disp < item.necessario) {
            notifs.push({
              id, tipo: 'warn',
              titulo: `Estoque baixo: ${item.nome}`,
              texto: `${turmas[turmaId].nome} • falta ${item.necessario - disp}${item.unidade} de ${item.nome}.`
            });
          }
        }
      });

      const utensilios = utensiliosFicha[fichaId] || [];
      utensilios.forEach(item => {
        const id = `${turmaId}-${fichaId}-util-${item.id}`;
        if (item.pendente) {
          notifs.push({
            id, tipo: 'info',
            titulo: `Aprovação Pendente`,
            texto: `Aguardando liberação do utensílio extra: ${item.nome}.`
          });
        }
      });
    });

    return notifs.map(n => ({ ...n, lida: lidas.includes(n.id) }));
  }

  function render() {
    const notifs = gerarNotificacoes();
    const naoLidas = notifs.filter(n => !n.lida).length;
    badge.hidden = naoLidas === 0;

    if (!notifs.length) {
      list.innerHTML = `<p class="notif-empty">🎉 Tudo certo! Nenhuma pendência.</p>`;
      return;
    }

    const icone = { err: 'error', warn: 'warning', info: 'schedule' };
    list.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.lida ? '' : 'unread'}">
        <span class="notif-icon ${n.tipo}">
          <span class="material-symbols-outlined">${icone[n.tipo]}</span>
        </span>
        <div class="notif-body">
          <p class="notif-title">${n.titulo}</p>
          <p class="notif-text">${n.texto}</p>
        </div>
      </div>`).join('');
  }

  window.atualizarNotificacoes = render;

  function marcarTodasLidas() {
    const ids = gerarNotificacoes().map(n => n.id);
    localStorage.setItem('sigec-notif-lidas', JSON.stringify(ids));
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

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  render();
})();

function atualizarSaudacao() {
  const dataAtual = new Date();
  const hora = dataAtual.getHours();
  let saudacao = "";

  if (hora >= 0 && hora < 12) {
    saudacao = "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  const elementoSaudacao = document.getElementById("mensagem-tempo");
  if (elementoSaudacao) {
    elementoSaudacao.innerText = saudacao;
  }
}

document.addEventListener("DOMContentLoaded", atualizarSaudacao);