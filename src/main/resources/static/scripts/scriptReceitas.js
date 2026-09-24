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


// ===== BASE DE DADOS DE RECEITAS =====
const RECIPES = [

    // ===== RECEITA 1 =====
    {
        id: 4,
        name: "Curry Vegano de Grão-de-bico",
        type: "VEGANA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-09-28",
        duration: "35 min",
        description: "Curry cremoso e reconfortante feito com leite de coco, grão-de-bico e especiarias indianas, perfeito para uma refeição vegana rápida.",
        ingredients: [
            { text: "2 latas de grão-de-bico cozido", tag: "Leguminosa" },
            { text: "1 lata de leite de coco", tag: "Coco" },
            { text: "1 unidade média de cebola picada" },
            { text: "2 dentes de alho" },
            { text: "1 colher de sopa de curry em pó" },
            { text: "1 colher de sopa de páprica doce/defumada" },
            { text: "0.5 maço de coentro fresco picado" },
            { text: "1 a gosto de sal refinado" }
        ],
        utensils: [
            "Panela média de fundo triplo",
            "Colher de pau / Espátula de silicone",
            "Faca chef e tábua de corte verde",
            "Abridor de latas profissional",
            "Colheres medidoras padrão gastronômico",
            "Bowls de inox para Mise en Place (3 un)"
        ],
        steps: [
            {
                title: "Refogue os aromáticos",
                text: "Aqueça um fio de óleo vegetal ou azeite na panela média. Adicione a cebola em brunoise e o alho picado bem fininho. Refogue em fogo médio até ficarem translúcidos e dourarem levemente."
            },
            {
                title: "Adicione as especiarias",
                text: "Junte o curry em pó e a páprica diretamente sobre a gordura do refogado. Mexa vigorosamente por cerca de 1 minuto para tostar levemente as especiarias e liberar os óleos essenciais."
            }
        ]
    },

    // ===== RECEITA 2 =====
    {
        id: 1,
        name: "Risoto de Funghi",
        type: "ITALIANA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-10-02",
        duration: "45 min",
        description: "Um risoto cremoso italiano que leva funghi secchi reidratados, caldo de legumes e um toque final de manteiga e queijo parmesão.",
        ingredients: [
            { text: "1 xícara de arroz arbóreo", tag: "Grão" },
            { text: "30g de funghi secchi", tag: "Cogumelo" },
            { text: "1L de caldo de legumes" },
            { text: "1/2 unidade de cebola picada" },
            { text: "2 colheres de sopa de manteiga" },
            { text: "1/2 xícara de vinho branco seco" },
            { text: "50g de queijo parmesão ralado" },
            { text: "1 pitada de sal e pimenta-do-reino" }
        ],
        utensils: [
            "Panela funda antiaderente",
            "Colher de pau / Espátula",
            "Concha média para caldo",
            "Tigela para hidratar o funghi",
            "Ralador de queijo fino",
            "Faca chef e tábua de corte"
        ],
        steps: [
            {
                title: "Hidrate o funghi",
                text: "Deixe o funghi secchi de molho em água morna por 20 minutos. Escorra e pique reservando a água."
            },
            {
                title: "Refogue a cebola",
                text: "Em uma panela, derreta 1 colher de manteiga e refogue a cebola até ficar translúcida."
            },
            {
                title: "Toste o arroz",
                text: "Adicione o arroz arbóreo e mexa por 2 minutos até soltar o amido superficial."
            },
            {
                title: "Deglaceie e hidrate",
                text: "Adicione o vinho branco, espere evaporar e adicione o caldo quente aos poucos, mexendo sem parar."
            }
        ]
    },

    // ===== RECEITA 3 =====
    {
        id: 2,
        name: "Feijoada Completa",
        type: "BRASILEIRA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-10-09",
        duration: "160 min",
        description: "Prato típico brasileiro à base de feijão preto cozido lentamente com carnes defumadas e salgadas.",
        ingredients: [
            { text: "500g de feijão preto", tag: "Leguminosa" },
            { text: "300g de carne seca dessalgada" },
            { text: "200g de linguiça calabresa defumada" },
            { text: "200g de costelinha de porco defumada" },
            { text: "2 folhas de louro seco" },
            { text: "1 unidade de cebola picada" },
            { text: "4 dentes de alho esmagados" }
        ],
        utensils: [
            "Panela de pressão de 7 litros",
            "Panela grande de fundo grosso",
            "Faca chef",
            "Tábua de corte vermelha (carnes)",
            "Escumadeira inox"
        ],
        steps: [
            {
                title: "Dessalgue prévio",
                text: "Deixe as carnes em imersão de água gelada por 12 horas antes da aula."
            },
            {
                title: "Cozimento do feijão",
                text: "Cozinhe o feijão com folhas de louro na pressão até atingir maciez sem desmanchar."
            },
            {
                title: "Dourar carnes e unificar",
                text: "Doure as carnes, junte ao feijão e reduza em fogo brando até encorpar."
            }
        ]
    },

    // ===== RECEITA 4 =====
    {
        id: 6,
        name: "Ratatouille Tradicional",
        type: "FRANCESA",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-10-30",
        duration: "70 min",
        description: "Ensopado clássico francês de vegetais laminados finamente com azeite de oliva e ervas de Provence.",
        ingredients: [
            { text: "1 unidade de berinjela média", tag: "Hortaliça" },
            { text: "2 unidades de abobrinha italiana" },
            { text: "3 tomates italianos maduros" },
            { text: "1 pimentão vermelho sem pele" },
            { text: "2 dentes de alho picados" },
            { text: "1 colher de sopa de ervas finas de Provence" },
            { text: "Azeite de oliva extravirgem a gosto" }
        ],
        utensils: [
            "Faca chef afiada",
            "Mandolina fatiadora profissional",
            "Tábua de corte verde",
            "Travessa refratária de cerâmica",
            "Papel manteiga vegetal"
        ],
        steps: [
            {
                title: "Laminar os vegetais",
                text: "Fatie berinjela, abobrinha e tomates em discos regulares de 2mm com a mandolina."
            },
            {
                title: "Montagem em leque",
                text: "Disponha os vegetais alternados em espiral concêntrica sobre a cama de molho de tomate temperado."
            },
            {
                title: "Cocção lenta",
                text: "Cubra com papel manteiga e asse a 170°C por 45 minutos."
            }
        ]
    },

    // ===== RECEITA 5 =====
    {
        id: 7,
        name: "Lasanha à Bolonhesa",
        type: "ITALIANA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-11-05",
        duration: "90 min",
        description: "Clássica lasanha italiana preparada com massa, molho à bolonhesa, presunto, queijo e molho branco.",
        ingredients: [
            { text: "500g de massa para lasanha", tag: "Massa" },
            { text: "500g de carne moída", tag: "Carne" },
            { text: "300g de molho de tomate", tag: "Molho" },
            { text: "200g de presunto fatiado" },
            { text: "300g de queijo muçarela" },
            { text: "500ml de molho branco" },
            { text: "50g de queijo parmesão ralado" }
        ],
        utensils: [
            "Panela grande",
            "Travessa refratária",
            "Colher de pau",
            "Faca chef",
            "Tábua de corte"
        ],
        steps: [
            {
                title: "Prepare o molho",
                text: "Refogue a carne moída e acrescente o molho de tomate. Cozinhe até encorpar."
            },
            {
                title: "Monte a lasanha",
                text: "Faça camadas alternadas de massa, molho, presunto, queijo e molho branco."
            },
            {
                title: "Asse",
                text: "Finalize com queijo parmesão e asse até dourar."
            }
        ]
    },

    // ===== RECEITA 6 =====
    {
        id: 8,
        name: "Bolo de Chocolate",
        type: "CONFEITARIA",
        cat: "Confeitaria",
        status: "datadas",
        dataPrevista: "2026-11-12",
        duration: "50 min",
        description: "Bolo de chocolate macio e saboroso, ideal para trabalhar técnicas básicas de confeitaria.",
        ingredients: [
            { text: "3 ovos", tag: "Ovos" },
            { text: "2 xícaras de farinha de trigo", tag: "Farinha" },
            { text: "1 xícara de açúcar" },
            { text: "1 xícara de chocolate em pó" },
            { text: "1 xícara de leite" },
            { text: "1/2 xícara de óleo" },
            { text: "1 colher de sopa de fermento" }
        ],
        utensils: [
            "Batedor de arame",
            "Tigela grande",
            "Forma para bolo",
            "Espátula",
            "Forno"
        ],
        steps: [
            {
                title: "Misture os ingredientes",
                text: "Misture os ovos, açúcar, óleo e leite até obter uma mistura homogênea."
            },
            {
                title: "Adicione os secos",
                text: "Acrescente a farinha, o chocolate em pó e misture delicadamente."
            },
            {
                title: "Finalize e asse",
                text: "Adicione o fermento e leve ao forno preaquecido até assar completamente."
            }
        ]
    },

    // ===== RECEITA 7 =====
    {
        id: 9,
        name: "Pão de Queijo",
        type: "BRASILEIRA",
        cat: "Panificação",
        status: "datadas",
        dataPrevista: "2026-11-18",
        duration: "40 min",
        description: "Preparação tradicional brasileira feita com polvilho e queijo, com textura crocante por fora e macia por dentro.",
        ingredients: [
            { text: "500g de polvilho doce", tag: "Polvilho" },
            { text: "250ml de leite" },
            { text: "100ml de óleo" },
            { text: "2 ovos", tag: "Ovos" },
            { text: "250g de queijo meia-cura ralado", tag: "Queijo" },
            { text: "1 colher de chá de sal" }
        ],
        utensils: [
            "Panela",
            "Tigela grande",
            "Colher de pau",
            "Assadeira",
            "Forno"
        ],
        steps: [
            {
                title: "Aqueça os líquidos",
                text: "Aqueça o leite e o óleo até iniciar a fervura."
            },
            {
                title: "Prepare a massa",
                text: "Despeje os líquidos sobre o polvilho e misture. Acrescente os ovos e o queijo."
            },
            {
                title: "Modele e asse",
                text: "Modele pequenas porções e asse até os pães ficarem dourados."
            }
        ]
    },

    // ===== RECEITA 8 =====
    {
        id: 10,
        name: "Salada Caesar",
        type: "INTERNACIONAL",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-11-25",
        duration: "30 min",
        description: "Salada clássica preparada com folhas frescas, croutons, queijo parmesão e molho Caesar.",
        ingredients: [
            { text: "1 pé de alface romana", tag: "Hortaliça" },
            { text: "100g de queijo parmesão" },
            { text: "100g de croutons", tag: "Panificação" },
            { text: "2 colheres de sopa de maionese" },
            { text: "1 dente de alho" },
            { text: "Suco de 1 limão" },
            { text: "Azeite de oliva a gosto" }
        ],
        utensils: [
            "Tigela grande",
            "Faca chef",
            "Tábua de corte",
            "Batedor de arame",
            "Ralador"
        ],
        steps: [
            {
                title: "Higienize as folhas",
                text: "Lave e higienize as folhas de alface. Seque bem antes da montagem."
            },
            {
                title: "Prepare o molho",
                text: "Misture os ingredientes do molho até obter uma textura cremosa e homogênea."
            },
            {
                title: "Monte a salada",
                text: "Misture as folhas com o molho e finalize com croutons e parmesão."
            }
        ]
    },

    // ===== RECEITA 9 =====
    {
        id: 11,
        name: "Moqueca de Peixe",
        type: "BRASILEIRA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-12-03",
        duration: "60 min",
        description: "Prato brasileiro preparado com peixe, tomate, cebola, pimentão, leite de coco e temperos.",
        ingredients: [
            { text: "800g de filé de peixe", tag: "Pescado" },
            { text: "2 tomates maduros", tag: "Hortaliça" },
            { text: "1 cebola grande" },
            { text: "1 pimentão vermelho" },
            { text: "200ml de leite de coco", tag: "Coco" },
            { text: "2 colheres de sopa de azeite de dendê" },
            { text: "Coentro fresco a gosto" }
        ],
        utensils: [
            "Panela de barro ou panela funda",
            "Faca chef",
            "Tábua de corte",
            "Colher de pau",
            "Tigelas para mise en place"
        ],
        steps: [
            {
                title: "Prepare os ingredientes",
                text: "Corte os tomates, a cebola e o pimentão em fatias regulares."
            },
            {
                title: "Monte a moqueca",
                text: "Disponha os vegetais e os filés de peixe em camadas na panela."
            },
            {
                title: "Cozinhe",
                text: "Acrescente o leite de coco e o azeite de dendê. Cozinhe em fogo médio até o peixe ficar macio."
            }
        ]
    }
];


// ===== ESTADO GLOBAL =====
let activeId = 4;
let activeStatus = "datadas";
let activeCategory = "todas";
let searchTerm = "";


// ===== ABAS DE STATUS =====
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


// ===== BUSCA POR NOME OU INGREDIENTE =====
const searchInput = document.getElementById('recipe-search');

if (searchInput) {
    searchInput.addEventListener('input', e => {
        searchTerm = e.target.value.trim().toLowerCase();

        renderList();
    });
}


// ===== RENDERIZAR LISTA (SEM ETIQUETA DE OBSERVAÇÃO) =====
function renderList() {

    const listCol = document.getElementById('listCol');
    const countLabel = document.getElementById('recipeCountLabel');

    if (!listCol) return;

    listCol.innerHTML = '';

    const filtered = RECIPES
        .filter(r =>
            activeStatus === 'todas' ||
            r.status === activeStatus
        )
        .filter(r =>
            activeCategory === 'todas' ||
            r.cat === activeCategory
        )
        .filter(r => {
            if (!searchTerm) return true;

            const matchName =
                r.name.toLowerCase().includes(searchTerm);

            const matchIngredient =
                r.ingredients.some(i =>
                    i.text.toLowerCase().includes(searchTerm)
                );

            return matchName || matchIngredient;
        });

    if (countLabel) {
        countLabel.textContent =
            `${filtered.length} receita${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        listCol.innerHTML =
            '<div style="font-size:13px; color:#94a3b8; padding:32px 16px; text-align:center;">Nenhuma receita encontrada para os filtros selecionados.</div>';
        return;
    }

    if (!filtered.some(x => x.id === activeId)) {
        activeId = filtered[0].id;
    }

    filtered.forEach(r => {
        const card = document.createElement('div');
        card.className =
            'recipe-card' +
            (r.id === activeId ? ' active' : '');

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h4 class="card-title">
                        ${r.name}
                    </h4>
                    <p class="card-category">
                        <span class="text-cat-type">
                            ${r.type}
                        </span>
                        &bull;
                        ${r.cat}
                    </p>
                </div>
                <span class="badge-status ${
            r.status === 'datadas'
                ? 'badge-datada'
                : 'badge-disponivel'
        }">
                    ${
            r.status === 'datadas'
                ? 'DATADA'
                : 'DISPONÍVEL'
        }
                </span>
            </div>

            <div class="card-meta">
                <span class="meta-item">
                    <span class="material-symbols-outlined">
                        calendar_today
                    </span>
                    ${r.dataPrevista || 'A definir'}
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


// ===== RENDERIZAR DETALHES (SEM BLOCO DE OBSERVAÇÃO) =====
function renderDetail() {

    const detailCol = document.getElementById('detailCol');

    if (!detailCol) return;

    const r = RECIPES.find(x => x.id === activeId);

    if (!r) {
        detailCol.innerHTML =
            '<div style="color:#94a3b8; text-align:center; padding-top:60px;">Selecione uma receita da lista.</div>';
        return;
    }

    const badgeTexto =
        r.status === 'datadas'
            ? `DATADA: ${r.dataPrevista}`
            : 'DISPONÍVEL EM AULA';

    detailCol.innerHTML = `
        <div class="recipe-detail-container">

            <div class="detail-header">
                <div class="detail-title-group">
                    <span class="recipe-type-label">
                        ${r.type}
                    </span>
                    <h1 class="recipe-main-title">
                        ${r.name}
                    </h1>
                </div>

                <div class="detail-badge-group">
                    <span class="pill-badge pill-badge-blue">
                        ${badgeTexto}
                    </span>
                </div>
            </div>

            <div class="recipe-lead-card">
                <p>
                    ${r.description}
                </p>
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
                                <span>
                                    ${ing.text}
                                </span>
                                ${ing.tag ? `
                                    <span class="tag-badge badge-amber">
                                        ${ing.tag}
                                    </span>
                                ` : ''}
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
                                <span>
                                    ${u}
                                </span>
                            </div>
                        `).join('') : `
                            <div class="resource-item">
                                <span>
                                    Nenhum utensílio listado.
                                </span>
                            </div>
                        `}
                    </div>
                </section>
            </div>

            <section class="steps-section">
                <h3 class="section-title">
                    <span class="bar-accent"></span>
                    Modo de Preparo Passo a Passo
                </h3>

                <div class="steps-list">
                    ${r.steps.map((st, index) => `
                        <div class="step-card">
                            <div class="step-number">
                                ${index + 1}
                            </div>
                            <div class="step-content">
                                <h4 class="step-title">
                                    ${st.title}
                                </h4>
                                <p class="step-description">
                                    ${st.text}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

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
                texto: 'A receita Curry Vegano de Grão-de-bico está agendada para breve.'
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
                        <p style="margin:0; font-weight:600; font-size:13px;">
                            ${n.titulo}
                        </p>
                        <p style="margin:2px 0 0 0; color:#64748b; font-size:12px;">
                            ${n.texto}
                        </p>
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


// ===== INICIALIZAR LISTA =====
renderList();