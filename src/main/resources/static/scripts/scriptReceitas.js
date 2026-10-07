// ===== ESTADO GLOBAL DINÂMICO =====
let turmas = [];
let RECIPES = [];
let detalhesCache = {}; // Guarda os detalhes já buscados para não sobrecarregar a API

let activeStatus = "todas";
let activeCategory = "todas";
let searchTerm = "";
let activeId = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosIniciais();
});

// ===== 1. BUSCA DE DADOS NA API =====
async function carregarDadosIniciais() {
    try {
        const [resTurmas, resFichas] = await Promise.all([
            fetch('/api/turmas').then(res => res.status === 204 ? [] : res.json()),
            fetch('/api/fichas').then(res => res.json())
        ]);

        turmas = resTurmas;

        // Mapeia os dados do banco para o formato que a tela de receitas espera
        RECIPES = resFichas.map(f => ({
            id: f.id,
            name: f.nomeFicha,
            type: "Geral", // Pode ser adaptado se a API retornar categoria
            cat: f.turma ? f.turma.nomeTurma : "Cozinha",
            status: f.data ? "datadas" : "disponivel",
            dataPrevista: f.data,
            duration: "45 min", // Pode ser substituído se houver duração no banco
            description: f.preparo || "Sem modo de preparo cadastrado.",
            turma: f.turma
        }));

        popularSeletorTurmas();
        renderList();
    } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        const listCol = document.getElementById('listCol');
        if (listCol) {
            listCol.innerHTML = '<p style="color:red; text-align:center; padding:20px;">Erro ao carregar as receitas do servidor.</p>';
        }
    }
}

// ===== 2. SELETOR DE TURMAS =====
const turmaSelect = document.getElementById('turma-select');

function popularSeletorTurmas() {
    if (!turmaSelect) return;

    turmaSelect.innerHTML = '<option value="todas">Todas as Turmas</option>';

    turmas.forEach(t => {
        const lab = t.laboratorio ? t.laboratorio.nomeLaboratorio : 'Lab Indefinido';
        turmaSelect.innerHTML += `<option value="${t.id}">${t.nomeTurma} — ${lab}</option>`;
    });

    turmaSelect.addEventListener('change', e => {
        // Se quiser filtrar a lista de receitas por turma, a lógica entra aqui
        renderList();
    });
}

// ===== 3. FORMATADOR DE DATA BRASILEIRA =====
function formatarDataBR(dataString) {
    if (!dataString) return 'A definir';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ===== 4. ABAS DE STATUS E FILTROS =====
document.querySelectorAll('.status-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.status-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatus = btn.dataset.status || 'todas';
        renderList();
    });
});

const categoryTabs = document.getElementById('categoryTabs');
if (categoryTabs) {
    categoryTabs.addEventListener('click', event => {
        const pill = event.target.closest('.cat-pill');
        if (!pill) return;

        categoryTabs.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.cat || 'todas';
        renderList();
    });
}

const searchInput = document.getElementById('recipe-search');
if (searchInput) {
    searchInput.addEventListener('input', e => {
        searchTerm = e.target.value.trim().toLowerCase();
        renderList();
    });
}

// ===== 5. RENDERIZAR LISTAGEM DE CARDS =====
function renderList() {
    const listCol = document.getElementById('listCol');
    const countLabel = document.getElementById('recipeCountLabel');

    if (!listCol) return;
    listCol.innerHTML = '';

    const filtered = RECIPES
        .filter(r => activeStatus === 'todas' || r.status === activeStatus)
        .filter(r => activeCategory === 'todas' || r.type === activeCategory)
        .filter(r => {
            if (!searchTerm) return true;
            return r.name.toLowerCase().includes(searchTerm) || r.description.toLowerCase().includes(searchTerm);
        });

    if (countLabel) {
        countLabel.textContent = `${filtered.length} receita${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        listCol.innerHTML = '<div style="font-size:13px; color:#94a3b8; padding:32px 16px; text-align:center;">Nenhuma receita encontrada.</div>';
        const detailCol = document.getElementById('detailCol');
        if (detailCol) detailCol.innerHTML = '<div style="color:#94a3b8; text-align:center; padding-top:60px;">Nenhuma receita selecionada.</div>';
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
                    <p class="card-category"><span class="text-cat-type">${r.type}</span> &bull; ${r.cat}</p>
                </div>
                <span class="badge-status ${badgeClasse}">${badgeTexto}</span>
            </div>
            <div class="card-meta">
                <span class="meta-item"><span class="material-symbols-outlined">calendar_today</span> ${dataFormatada}</span>
                <span class="meta-duration">${r.duration}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            activeId = r.id;
            renderList();
        });

        listCol.appendChild(card);
    });

    carregarEExibirDetalhes();
}

// ===== 6. BUSCAR E RENDERIZAR DETALHES DA RECEITA =====
async function carregarEExibirDetalhes() {
    const detailCol = document.getElementById('detailCol');
    if (!detailCol) return;

    const r = RECIPES.find(x => x.id === activeId);
    if (!r) return;

    detailCol.innerHTML = '<div style="text-align:center; padding-top:60px; color:#94a3b8;">Carregando detalhes...</div>';

    try {
        // Verifica se já buscou os detalhes antes para não chamar a API à toa
        if (!detalhesCache[activeId]) {
            const res = await fetch(`/api/fichas/${activeId}/detalhes`);
            detalhesCache[activeId] = await res.json();
        }

        renderDetail(r, detalhesCache[activeId]);
    } catch (err) {
        console.error("Erro ao carregar insumos e utensílios:", err);
        detailCol.innerHTML = '<div style="color:red; text-align:center; padding-top:60px;">Erro ao carregar detalhes desta receita.</div>';
    }
}

function renderDetail(r, detalhesDaAPI) {
    const detailCol = document.getElementById('detailCol');
    if (!detailCol) return;

    const dataFormatada = formatarDataBR(r.dataPrevista);
    const badgeClasse = r.status === 'datadas' ? 'badge-datada' : 'badge-disponivel';
    const badgeTexto = r.status === 'datadas' ? `DATADA: ${dataFormatada}` : `DISPONÍVEL: ${dataFormatada}`;

    // Monta o HTML dos Insumos vindos do Banco
    const htmlInsumos = detalhesDaAPI.insumos.length > 0
        ? detalhesDaAPI.insumos.map(ing => {
            const nomeProd = ing.produto ? ing.produto.nomeProduto : 'Insumo desconhecido';
            const unidade = ing.produto ? ing.produto.unidade : '';
            return `<div class="resource-item"><span>${nomeProd} - ${ing.quantidade}${unidade}</span></div>`;
        }).join('')
        : '<div class="resource-item"><span>Nenhum insumo cadastrado.</span></div>';

    // Monta o HTML dos Utensílios vindos do Banco
    const htmlUtensilios = detalhesDaAPI.utensilios.length > 0
        ? detalhesDaAPI.utensilios.map(u => {
            const nomeUtil = u.utensilio ? u.utensilio.nomeUtensilio : 'Utensílio desconhecido';
            return `<div class="resource-item"><span>${nomeUtil}</span></div>`;
        }).join('')
        : '<div class="resource-item"><span>Nenhum utensílio cadastrado.</span></div>';

    detailCol.innerHTML = `
        <div class="recipe-detail-container">
            <div class="detail-header">
                <div class="detail-title-group">
                    <span class="recipe-type-label">${r.type}</span>
                    <h1 class="recipe-main-title">${r.name}</h1>
                </div>
                <div class="detail-badge-group">
                    <span class="pill-badge ${badgeClasse}">${badgeTexto}</span>
                </div>
            </div>

            <div class="recipe-lead-card">
                <p><strong>Modo de Preparo:</strong><br>${r.description}</p>
            </div>

            <div class="recipe-resources-grid">
                <section class="resource-block">
                    <h3 class="section-title"><span class="bar-accent"></span>Ingredientes Necessários</h3>
                    <div class="items-two-col">${htmlInsumos}</div>
                </section>

                <section class="resource-block">
                    <h3 class="section-title"><span class="bar-accent"></span>Utensílios Utilizados</h3>
                    <div class="items-two-col">${htmlUtensilios}</div>
                </section>
            </div>
        </div>
    `;
}

// ===== 7. CONTROLES DE INTERFACE (Menu e Notificações) =====
(function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');

    if (!sidebar || !menuToggle || !overlay) return;

    function openSidebar() { sidebar.classList.add('show'); overlay.classList.add('show'); }
    function closeSidebar() { sidebar.classList.remove('show'); overlay.classList.remove('show'); }

    menuToggle.addEventListener('click', () => sidebar.classList.contains('show') ? closeSidebar() : openSidebar());
    overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeSidebar(); });
})();