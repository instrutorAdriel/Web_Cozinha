const RECIPES = [
    {
        id:1, name:"Risoto de Funghi", cat:"Italiana", time:"40 min", level:"Médio", serves:"4 porções",
        status:"disponivel",
        description:"Um risoto cremoso italiano que leva funghi secchi reidratados, caldo de legumes e um toque final de manteiga e queijo parmesão. Ideal para um jantar especial.",
        ingredients:["1 xícara de arroz arbóreo","30g de funghi secchi","1L de caldo de legumes","1/2 cebola picada","2 colheres de manteiga","1/2 xícara de vinho branco","50g de queijo parmesão ralado","Sal e pimenta a gosto"],
        steps:[
            {title:"Hidrate o funghi", text:"Deixe o funghi secchi de molho em água morna por 20 minutos. Escorra e pique.", time:"20 min"},
            {title:"Refogue a cebola", text:"Em uma panela, derreta 1 colher de manteiga e refogue a cebola até ficar transparente.", time:"5 min"},
            {title:"Toste o arroz", text:"Adicione o arroz arbóreo e mexa por 2 minutos até ficar levemente translúcido.", time:"2 min"},
            {title:"Deglaceie com vinho", text:"Adicione o vinho branco e mexa até evaporar completamente.", time:"3 min"},
            {title:"Cozinhe adicionando caldo aos poucos", text:"Adicione o caldo quente em conchas, mexendo sempre, até o arroz absorver antes de adicionar mais.", time:"18 min"},
            {title:"Finalize", text:"Fora do fogo, adicione a manteiga restante e o parmesão. Misture bem e sirva imediatamente.", time:"2 min"}
        ]
    },
    {
        id:2, name:"Feijoada Completa", cat:"Brasileira", time:"3h", level:"Difícil", serves:"8 porções",
        status:"disponivel",
        description:"Prato típico brasileiro à base de feijão preto cozido lentamente com carnes defumadas e salgadas, servido tradicionalmente com arroz, couve e farofa.",
        ingredients:["500g de feijão preto","300g de carne seca","200g de linguiça calabresa","200g de costelinha de porco","2 folhas de louro","1 cebola picada","4 dentes de alho","Sal e pimenta a gosto"],
        steps:[
            {title:"Dessalgue as carnes", text:"Deixe a carne seca de molho, trocando a água algumas vezes, por 12 horas.", time:"12h"},
            {title:"Cozinhe o feijão", text:"Cozinhe o feijão preto na panela de pressão até ficar macio.", time:"40 min"},
            {title:"Doure as carnes", text:"Em uma panela grande, doure a linguiça e a costelinha.", time:"15 min"},
            {title:"Junte tudo", text:"Adicione o feijão cozido, a carne seca desfiada, louro, cebola e alho. Cozinhe em fogo baixo.", time:"1h30"},
            {title:"Finalize e sirva", text:"Ajuste o sal, retire o excesso de gordura e sirva com arroz branco, couve refogada e farofa.", time:"10 min"}
        ]
    },
    {
        id:3, name:"Sushi de Salmão", cat:"Japonesa", time:"45 min", level:"Difícil", serves:"2 porções",
        status:"aplicada",
        description:"Sushi tradicional japonês com arroz temperado, salmão fresco e alga nori, enrolado e cortado em peças elegantes.",
        ingredients:["2 xícaras de arroz para sushi","3 colheres de vinagre de arroz","200g de salmão fresco","4 folhas de alga nori","Molho shoyu","Gengibre em conserva","Wasabi"],
        steps:[
            {title:"Prepare o arroz", text:"Cozinhe o arroz e tempere com vinagre de arroz, açúcar e sal ainda quente.", time:"20 min"},
            {title:"Corte o salmão", text:"Corte o salmão fresco em tiras finas e uniformes.", time:"5 min"},
            {title:"Monte os rolinhos", text:"Espalhe o arroz sobre a alga nori, adicione o salmão e enrole com a esteira de bambu.", time:"15 min"},
            {title:"Corte e sirva", text:"Corte os rolinhos em peças iguais e sirva com shoyu, gengibre e wasabi.", time:"5 min"}
        ]
    },
    {
        id:4, name:"Curry Vegano de Grão-de-bico", cat:"Vegana", time:"35 min", level:"Fácil", serves:"4 porções",
        status:"disponivel",
        description:"Curry cremoso e reconfortante feito com leite de coco, grão-de-bico e especiarias indianas, perfeito para uma refeição vegana rápida.",
        ingredients:["2 latas de grão-de-bico cozido","1 lata de leite de coco","1 cebola picada","2 dentes de alho","1 colher de curry em pó","1 colher de páprica","Coentro fresco","Sal a gosto"],
        steps:[
            {title:"Refogue os aromáticos", text:"Refogue a cebola e o alho até dourarem levemente.", time:"5 min"},
            {title:"Adicione as especiarias", text:"Junte o curry em pó e a páprica, mexendo por 1 minuto para liberar o aroma.", time:"2 min"},
            {title:"Adicione o grão-de-bico e o leite de coco", text:"Misture bem e deixe cozinhar em fogo médio-baixo.", time:"20 min"},
            {title:"Finalize", text:"Ajuste o sal, finalize com coentro fresco picado e sirva com arroz basmati.", time:"8 min"}
        ]
    },
    {
        id:5, name:"Tacos de Carnitas", cat:"Mexicana", time:"1h", level:"Médio", serves:"4 porções",
        status:"disponivel",
        description:"Tacos mexicanos com carne de porco desfiada e levemente crocante, servidos em tortilhas quentes com pico de gallo e limão.",
        ingredients:["600g de carne de porco","1 laranja (suco)","2 dentes de alho","1 colher de cominho","Tortillas de milho","Cebola roxa picada","Coentro fresco","Limão"],
        steps:[
            {title:"Tempere a carne", text:"Tempere a carne de porco com sal, cominho e alho amassado.", time:"10 min"},
            {title:"Cozinhe lentamente", text:"Cozinhe a carne com suco de laranja em fogo baixo até ficar bem macia.", time:"40 min"},
            {title:"Desfie e doure", text:"Desfie a carne e leve à frigideira quente para dourar as bordas.", time:"8 min"},
            {title:"Monte os tacos", text:"Sirva a carne em tortillas quentes com cebola roxa, coentro e limão.", time:"5 min"}
        ]
    },
    {
        id:6, name:"Ratatouille", cat:"Francesa", time:"55 min", level:"Médio", serves:"4 porções",
        status:"aplicada",
        description:"Ensopado clássico francês de vegetais como abobrinha, berinjela e tomate, cozidos lentamente com ervas provençais.",
        ingredients:["1 berinjela","2 abobrinhas","2 tomates","1 pimentão","1 cebola","2 dentes de alho","Ervas de Provence","Azeite de oliva"],
        steps:[
            {title:"Corte os vegetais", text:"Corte todos os vegetais em fatias finas e uniformes.", time:"15 min"},
            {title:"Refogue a base", text:"Refogue cebola e alho no azeite até perfumar.", time:"5 min"},
            {title:"Monte em camadas", text:"Disponha as fatias de vegetais alternadas sobre a base de tomate.", time:"10 min"},
            {title:"Asse lentamente", text:"Leve ao forno coberto com papel alumínio até os vegetais ficarem macios.", time:"25 min"}
        ]
    }
];

let activeId = RECIPES[0].id;
let searchTerm = "";
let activeStatus = "todas";

// Abas de Status (Filtro Interno)
document.querySelectorAll('.status-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.status-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatus = btn.dataset.status || 'todas';
        renderList();
    });
});

// Filtro de Busca Integrado no Topo (Input da Barra Branca)
const searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
    searchInputEl.addEventListener('input', e => {
        searchTerm = e.target.value.trim().toLowerCase();
        renderList();
    });
}

// Renderização da Lista de Cards (Sub-coluna Esquerda)
function renderList() {
    const listCol = document.getElementById('listCol');
    if (!listCol) return;

    listCol.innerHTML = '';

    const filtered = RECIPES
        .filter(r => activeStatus === 'todas' || r.status === activeStatus)
        .filter(r => r.name.toLowerCase().includes(searchTerm));

    if (filtered.length === 0) {
        listCol.innerHTML = '<div style="font-size:13px; color:#94a3b8; padding:12px; text-align:center;">Nenhuma receita encontrada.</div>';
        return;
    }

    filtered.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-card' + (r.id === activeId ? ' active' : '');
        card.innerHTML = `
            <div class="rc-header">
                <div class="rc-title">${r.name}</div>
                <div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-aplicada'}">
                    ${r.status === 'disponivel' ? 'Disponível' : 'Aplicada'}
                </div>
            </div>
            <div class="rc-category">${r.cat}</div>
            <div class="rc-meta">⏱ ${r.time} · 📊 ${r.level}</div>
        `;
        card.addEventListener('click', () => {
            activeId = r.id;
            renderList();
            renderDetail();

            // Em telas menores, ao escolher uma receita, fecha a lista
            // e mostra o painel de detalhes automaticamente
            if (window.innerWidth <= 768) {
                document.body.classList.add('show-detail');
            }
        });
        listCol.appendChild(card);
    });

    if (filtered.length > 0 && !filtered.some(x => x.id === activeId)) {
        activeId = filtered[0].id;
        renderDetail();
    }
}

// Renderização dos Detalhes da Receita (Lado Direito)
function renderDetail() {
    const detailCol = document.getElementById('detailCol');
    if (!detailCol) return;

    const r = RECIPES.find(x => x.id === activeId);
    if (!r) {
        detailCol.innerHTML = '<div style="color:#94a3b8; text-align:center; padding-top:40px;">Selecione uma receita da lista.</div>';
        return;
    }

    detailCol.innerHTML = `
        <div class="detail-main-header">
            <div>
                <div class="rc-category">${r.cat}</div>
                <h2 class="detail-main-title">${r.name}</h2>
            </div>
            <div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-aplicada'}" style="font-size:11px; padding:6px 14px;">
                ${r.status === 'disponivel' ? 'Disponível' : 'Aplicada'}
            </div>
        </div>

        <div class="meta-info-grid">
            
        </div>

        <div class="recipe-intro">${r.description}</div>

        <div class="block-title">Ingredientes Necessários</div>
        <ul class="ingredients-layout">
            ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
        </ul>

        <div class="block-title">Modo de Preparo Passo a Passo</div>
        <ol class="steps-layout">
            ${r.steps.map(s => `
                <li class="step-card">
                    <div class="step-circle"></div>
                    <div class="step-content">
                        <h4>${s.title}</h4>
                        <p>${s.text}</p>
                        <span class="step-duration">⏱ ${s.time}</span>
                    </div>
                </li>
            `).join('')}
        </ol>
    `;
}

/* ==========================================================================
   RESPONSIVIDADE — Toggle da Sidebar (mobile/tablet)
   Requer no HTML:
     - botão com id="menu-toggle" (já existe no topbar)
     - a sidebar com id="sidebar" (já existe)
     - um elemento <div class="overlay" id="overlay"></div>
       logo após a <aside class="sidebar" id="sidebar"> no HTML
   ========================================================================== */
(function initSidebarToggle() {
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

    // Fecha a sidebar automaticamente se a tela for redimensionada
    // para um tamanho onde ela volta a ficar fixa (desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeSidebar();
    });
})();

// Inicialização segura das views
renderList();
renderDetail();