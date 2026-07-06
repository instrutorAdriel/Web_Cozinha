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

const CUISINES = ["Todas as cozinhas", ...Array.from(new Set(RECIPES.map(r=>r.cat)))];
let activeId = RECIPES[0].id;
let searchTerm = "";
let activeCuisine = "Todas as cozinhas";
let activeStatus = "todas";

// Filtros por Status com verificação antiqueda
document.querySelectorAll('.status-filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        document.querySelectorAll('.status-filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        activeStatus = btn.dataset.status || (btn.textContent.trim().toLowerCase() === 'todas' ? 'todas' : btn.textContent.trim().toLowerCase().replace('í', 'i').replace('ê', 'e'));
        renderList();
    });
});

// População e Filtro de Cozinha
const cuisineFilterEl = document.getElementById('cuisineFilter');
if (cuisineFilterEl) {
    CUISINES.forEach(c=>{
        const opt = document.createElement('option');
        opt.value=c; opt.textContent=c;
        cuisineFilterEl.appendChild(opt);
    });

    cuisineFilterEl.addEventListener('change', e=>{
        activeCuisine = e.target.value;
        renderList();
    });
}

// Filtro de Busca por Texto
const searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
    searchInputEl.addEventListener('input', e=>{
        searchTerm = e.target.value.trim().toLowerCase();
        renderList();
    });
}

// Renderizar a Lista de Receitas (Esquerda)
function renderList(){
    const listCol = document.getElementById('listCol');
    if (!listCol) return;

    listCol.innerHTML = '';

    const filtered = RECIPES
        .filter(r => activeCuisine === 'Todas as cozinhas' || r.cat === activeCuisine)
        .filter(r => activeStatus === 'todas' || r.status === activeStatus)
        .filter(r => r.name.toLowerCase().includes(searchTerm));

    if(filtered.length === 0){
        listCol.innerHTML = '<div style="font-size:12.5px;color:#9aa1b2;padding:10px;">Nenhuma receita encontrada.</div>';
        return;
    }

    filtered.forEach(r=>{
        const item = document.createElement('div');
        item.className = 'recipe-item' + (r.id === activeId ? ' active' : '');
        item.innerHTML = `
            <div class="ri-top">
                <div class="ri-name">${r.name}</div>
                <div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-aplicada'}">
                    ${r.status === 'disponivel' ? 'Disponível' : 'Aplicada'}
                </div>
            </div>
            <div class="ri-cat">${r.cat}</div>
            <div class="ri-meta">${r.time} · ${r.level} · ${r.serves}</div>
        `;
        item.addEventListener('click', ()=>{
            activeId = r.id;
            renderList();
            renderDetail();
        });
        listCol.appendChild(item);
    });
}

// Renderizar Área de Detalhes da Receita (Direita)
function renderDetail(){
    const detailCol = document.getElementById('detailCol');
    if (!detailCol) return;

    const r = RECIPES.find(x=>x.id === activeId);
    if(!r){ detailCol.innerHTML=''; return; }

    detailCol.innerHTML = `
        <div class="detail-header">
            <div>
                <div class="detail-cat">${r.cat}</div>
                <h2 class="detail-title">${r.name}</h2>
            </div>
            <div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-aplicada'}">
                ${r.status === 'disponivel' ? 'Disponível' : 'Aplicada'}
            </div>
        </div>

        <div class="meta-row">
            <div class="meta-chip">⏱ <b>${r.time}</b></div>
            <div class="meta-chip">📊 <b>${r.level}</b></div>
            <div class="meta-chip">🍽 <b>${r.serves}</b></div>
        </div>

        <div class="description">${r.description}</div>

        <div class="section-title"><span class="bar"></span> Ingredientes</div>
        <ul class="ingredients">
            ${r.ingredients.map(i=>`<li>${i}</li>`).join('')}
        </ul>

        <div class="section-title"><span class="bar"></span> Modo de preparo</div>
        <ul class="steps">
            ${r.steps.map(s=>`
                <li class="step-item">
                    <div class="step-num"></div> <!-- Vazio para permitir o contador automático do CSS -->
                    <div class="step-body">
                        <h4>${s.title}</h4>
                        <p>${s.text}</p>
                        <span class="step-time">⏱ ${s.time}</span>
                    </div>
                </li>
            `).join('')}
        </ul>

        <div class="legend">
            <span><i style="background:var(--green);"></i> Disponível</span>
            <span><i style="background:var(--blue);"></i> Aplicada</span>
            <span><i style="background:var(--orange);"></i> Etapa do preparo</span>
        </div>
    `;
}

// Botão Fechar Modal
const closeBtnEl = document.querySelector('.close-btn');
if (closeBtnEl) {
    closeBtnEl.addEventListener('click', ()=>{
        const modalEl = document.querySelector('.modal');
        if (modalEl) modalEl.style.display='none';
    });
}

// Inicialização segura
renderList();
renderDetail();