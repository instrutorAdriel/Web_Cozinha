// ===== ENTIDADES DE TURMA =====
const turmas = {
    "2024.1.A": { nome: "Turma 2024.1.A", cozinha: "Padaria Lab 01" },
    "2024.1.C": { nome: "Turma 2024.1.C", cozinha: "Cozinha Pedagógica 02" },
    "2024.2.N": { nome: "Turma 2024.2.N", cozinha: "Cozinha Pedagógica 04" }
};

let turmaAtual = "2024.1.A";
const turmaSelect = document.getElementById('turma-select');

function popularSeletorTurmas() {
    if (!turmaSelect) return;

    turmaSelect.innerHTML = Object.entries(turmas)
        .map(([k, t]) => `<option value="${k}">${t.nome} — ${t.cozinha}</option>`)
        .join('');

    turmaSelect.value = turmaAtual;
}

if (turmaSelect) {
    turmaSelect.addEventListener('change', e => {
        turmaAtual = e.target.value;
    });
}

popularSeletorTurmas();


// ===== ESTADO GLOBAL (Sincronizado com o botão ativo no HTML) =====
const btnAtivoHtml = document.querySelector('.status-tab-btn.active');
let activeStatus = btnAtivoHtml ? (btnAtivoHtml.dataset.status || 'datadas') : 'datadas';
let activeCategory = "todas";
let searchTerm = "";
let activeId = 4;


// ===== FORMATADOR DE DATA BRASILEIRA =====
function formatarDataBR(dataString) {
    if (!dataString) return 'A definir';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ===== ABAS DE STATUS (TODAS / DISPONÍVEIS / DATADAS) =====
document.querySelectorAll('.status-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.status-tab-btn')
            .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');
        activeStatus = btn.dataset.status || 'todas';

        renderList();
    });
});


// ===== CATEGORIAS PEDAGÓGICAS =====
const categoryTabs = document.getElementById('categoryTabs');

if (categoryTabs) {
    categoryTabs.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            categoryTabs.querySelectorAll('.cat-pill')
                .forEach(p => p.classList.remove('active'));

            pill.classList.add('active');
            activeCategory = pill.dataset.cat || 'todas';

            renderList();
        });
    });
}


// ===== BUSCA EM TEMPO REAL =====
const searchInput = document.getElementById('recipe-search');

if (searchInput) {
    searchInput.addEventListener('input', e => {
        searchTerm = e.target.value.trim().toLowerCase();
        renderList();
    });
}


// ===== RENDERIZAR LISTAGEM DE CARDS =====
function renderList() {
    const listCol = document.getElementById('listCol');
    const countLabel = document.getElementById('recipeCountLabel');

    if (!listCol) return;

    listCol.innerHTML = '';

    const filtered = RECIPES
        .filter(r => activeStatus === 'todas' || r.status === activeStatus)
        .filter(r => activeCategory === 'todas' || r.cat === activeCategory)
        .filter(r => {
            if (!searchTerm) return true;
            const matchName = r.name ? r.name.toLowerCase().includes(searchTerm) : false;
            const matchIng = r.ingredients ? r.ingredients.some(i => i.text && i.text.toLowerCase().includes(searchTerm)) : false;
            return matchName || matchIng;
        });

    if (countLabel) {
        countLabel.textContent = `${filtered.length} receita${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        listCol.innerHTML =
            '<div style="font-size:13px; color:#94a3b8; padding:32px 16px; text-align:center;">Nenhuma receita encontrada para os filtros selecionados.</div>';
        const detailCol = document.getElementById('detailCol');
        if (detailCol) {
            detailCol.innerHTML = '<div style="color:#94a3b8; text-align:center; padding-top:60px;">Nenhuma receita selecionada.</div>';
        }
        return;
    }

    if (!filtered.some(x => x.id === activeId)) {
        activeId = filtered[0].id;
    }

    filtered.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-card' + (r.id === activeId ? ' active' : '');

        const dataFormatada = formatarDataBR(r.dataPrevista);
        const badgeClasse = r.status === 'datadas' ? 'badge-datada' : 'badge-disponivel';
        const badgeTexto = r.status === 'datadas' ? 'DATADA' : 'DISPONÍVEL';

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h4 class="card-title">${r.name}</h4>
                    <p class="card-category">
                        <span class="text-cat-type">${r.type}</span>
                        &bull;
                        ${r.cat}
                    </p>
                </div>
                <span class="badge-status ${badgeClasse}">
                    ${badgeTexto}
                </span>
            </div>

            <div class="card-meta">
                <span class="meta-item">
                    <span class="material-symbols-outlined">calendar_today</span>
                    ${dataFormatada}
                </span>
                <span class="meta-duration">
                    ${r.duration || '30 min'}
                </span>
            </div>
        `;

        card.addEventListener('click', () => {
            activeId = r.id;
            renderList();
        });

        listCol.appendChild(card);
    });

    renderDetail();
}


// ===== RENDERIZAR DETALHES (APENAS INGREDIENTES E UTENSÍLIOS) =====
function renderDetail() {
    const detailCol = document.getElementById('detailCol');
    if (!detailCol) return;

    const r = RECIPES.find(x => x.id === activeId);

    if (!r) {
        detailCol.innerHTML = '<div style="color:#94a3b8; text-align:center; padding-top:60px;">Selecione uma receita da lista.</div>';
        return;
    }

    const dataFormatada = formatarDataBR(r.dataPrevista);
    const badgeClasse = r.status === 'datadas' ? 'badge-datada' : 'badge-disponivel';
    const badgeTexto = r.status === 'datadas' ? `DATADA: ${dataFormatada}` : `DISPONÍVEL: ${dataFormatada}`;

    detailCol.innerHTML = `
        <div class="recipe-detail-container">

            <div class="detail-header">
                <div class="detail-title-group">
                    <span class="recipe-type-label">${r.type}</span>
                    <h1 class="recipe-main-title">${r.name}</h1>
                </div>

                <div class="detail-badge-group">
                    <span class="pill-badge ${badgeClasse}">
                        ${badgeTexto}
                    </span>
                </div>
            </div>

            <div class="recipe-lead-card">
                <p>${r.description}</p>
            </div>

            <div class="recipe-resources-grid">
                <section class="resource-block">
                    <h3 class="section-title">
                        <span class="bar-accent"></span>
                        Ingredientes Necessários
                    </h3>

                    <div class="items-two-col">
                        ${r.ingredients.map(ing => `
                            <div class="resource-item">
                                <span>${ing.text}</span>${ing.tag ? `<span class="tag-badge badge-amber">${ing.tag}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="resource-block">
                    <h3 class="section-title">
                        <span class="bar-accent"></span>
                        Utensílios Utilizados
                    </h3>

                    <div class="items-two-col">
                        ${r.utensils && r.utensils.length ? r.utensils.map(u => `
                            <div class="resource-item">
                                <span>${u}</span>
                            </div>
                        `).join('') : `
                            <div class="resource-item">
                                <span>Nenhum utensílio listado.</span>
                            </div>
                        `}
                    </div>
                </section>
            </div>

        </div>
    `;
}


// ===== CONTROLE DA BARRA LATERAL RESPONSIVA =====
(function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');

    if (!sidebar || !menuToggle || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
    }

    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    menuToggle.addEventListener('click', () => {
        sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeSidebar();
    });
})();


// ===== NOTIFICAÇÕES =====
(function initNotifications() {
    const btn = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    const clear = document.getElementById('notif-clear');

    if (!btn || !panel) return;

    const STORAGE_KEY = 'sigec-notif-lidas-receitas';

    function gerarNotificacoes() {
        const notifs = [
            {
                id: 1,
                tipo: 'warn',
                titulo: 'Data Próxima',
                texto: 'A receita Curry Vegano de Grão-de-bico está programada para aula.'
            }
        ];

        const lidas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        return notifs.map(n => ({
            ...n,
            lida: lidas.includes(n.id)
        }));
    }

    function render() {
        const notifs = gerarNotificacoes();
        const naoLidas = notifs.filter(n => !n.lida).length;

        badge.hidden = naoLidas === 0;

        if (!notifs.length) {
            list.innerHTML =
                `<p style="padding:16px; color:#94a3b8; font-size:13px; text-align:center;">
                    Nenhuma notificação nova.
                </p>`;
            return;
        }

        list.innerHTML =
            notifs.map(n => `
                <div style="display:flex; gap:10px; padding:10px; border-bottom:1px solid #f1f5f9;">
                    <div>
                        <p style="margin:0; font-weight:600; font-size:13px;">${n.titulo}</p>
                        <p style="margin:2px 0 0 0; color:#64748b; font-size:12px;">${n.texto}</p>
                    </div>
                </div>
            `).join('');
    }

    function toggle(open) {
        const abrir = open ?? !panel.classList.contains('show');
        panel.classList.toggle('show', abrir);
        btn.setAttribute('aria-expanded', abrir);
        if (abrir) render();
    }

    btn.addEventListener('click', e => {
        e.stopPropagation();
        toggle();
    });

    if (clear) {
        clear.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([1]));
            render();
        });
    }

    document.addEventListener('click', e => {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            toggle(false);
        }
    });

    render();
})();


// ===== INFERÊNCIA INTELIGENTE DE CATEGORIA PEDAGÓGICA =====
function inferirCategoria(nome = '', preparo = '') {
    const texto = `${nome || ''} ${preparo || ''}`.toLowerCase();
    if (texto.includes('pão') || texto.includes('pao') || texto.includes('massa') || texto.includes('fermento') || texto.includes('brioche') || texto.includes('baguete') || texto.includes('focaccia')) {
        return 'Panificação';
    }
    if (texto.includes('bolo') || texto.includes('doce') || texto.includes('torta') || texto.includes('chocolate') || texto.includes('confeitaria') || texto.includes('sobremesa') || texto.includes('creme') || texto.includes('cannoli')) {
        return 'Confeitaria';
    }
    if (texto.includes('salada') || texto.includes('ceviche') || texto.includes('carpaccio') || texto.includes('fria') || texto.includes('tartar')) {
        return 'Cozinha Fria';
    }
    return 'Cozinha Quente';
}


// ===== CARREGAMENTO DE RECEITAS DO BANCO DE DADOS (SPRING BOOT REST API) =====

let RECIPES = [];

async function carregarReceitasDoBanco() {
    try {
        const response = await fetch('/api/receitas');

        if (!response.ok) {
            console.warn(`Aviso ao consultar /api/receitas: HTTP ${response.status}`);
            return;
        }

        const fichasDoBanco = await response.json();

        if (Array.isArray(fichasDoBanco) && fichasDoBanco.length > 0) {
            RECIPES = fichasDoBanco.map(f => {
                const isDatada = Boolean(f.data);
                const categoria = inferirCategoria(f.nomeFicha, f.preparo);

                const mappedIngredients = (f.insumos && f.insumos.length > 0)
                    ? f.insumos.map(insumo => ({
                        text: `Insumo #${insumo.idProduto || insumo.id} — Quantidade: ${insumo.quantidade}`,
                        tag: insumo.cancelado === 'S' ? 'Cancelado' : 'Insumo'
                    }))
                    : [
                        { text: "Ingredientes detalhados na ficha técnica do SIGEC." }
                    ];

                return {
                    id: f.id,
                    name: f.nomeFicha || "Receita sem nome",
                    type: "PEDAGÓGICA",
                    cat: categoria,
                    status: isDatada ? "datadas" : "disponivel",
                    dataPrevista: f.data || null,
                    duration: "45 min",
                    description: f.preparo || "Modo de preparo registrado no banco de dados SIGEC.",
                    ingredients: mappedIngredients,
                    utensils: []
                };
            });

            // Ajusta o activeId para a primeira receita vinda do banco se o activeId não estiver presente
            if (!RECIPES.some(r => r.id === activeId) && RECIPES.length > 0) {
                activeId = RECIPES[0].id;
            }

            renderList();
        }
    } catch (erro) {
        console.error("Erro ao carregar receitas do banco:", erro);
    }
}


// ===== INICIALIZAR LISTA E CARREGAR DADOS DO BANCO =====
renderList();
carregarReceitasDoBanco();
