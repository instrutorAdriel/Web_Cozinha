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


// ===== BASE DE DADOS DE RECEITAS (15 DATADAS E 15 DISPONÍVEIS) =====
const RECIPES = [

    // ==========================================
    //           15 RECEITAS DATADAS
    // ==========================================

    // ===== DATADA 1 =====
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
            "Bowls de inox para Mise en Place"
        ]
    },

    // ===== DATADA 2 =====
    {
        id: 2,
        name: "Feijoada Completa Tradicional",
        type: "BRASILEIRA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-10-05",
        duration: "160 min",
        description: "Prato típico brasileiro à base de feijão preto cozido lentamente com carnes defumadas e salgadas.",
        ingredients: [
            { text: "500g de feijão preto", tag: "Leguminosa" },
            { text: "300g de carne seca dessalgada", tag: "Carne" },
            { text: "200g de linguiça calabresa defumada" },
            { text: "200g de costelinha de porco defumada" },
            { text: "2 folhas de louro seco" },
            { text: "1 unidade de cebola picada" },
            { text: "4 dentes de alho esmagados" }
        ],
        utensils: [
            "Panela de pressão de 7 litros",
            "Panela grande de fundo grosso",
            "Faca chef e tábua vermelha",
            "Escumadeira inox"
        ]
    },

    // ===== DATADA 3 =====
    {
        id: 13,
        name: "Ceviche Clássico Peruano",
        type: "LATINO-AMERICANA",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-10-12",
        duration: "25 min",
        description: "Peixe branco fresco curado no 'leche de tigre' à base de limão, coentro, alho, gengibre e pimenta dedo-de-moça.",
        ingredients: [
            { text: "500g de filé de tilápia ou robalo fresco", tag: "Pescado" },
            { text: "6 unidades de limão tahiti espremidos" },
            { text: "1 unidade de cebola roxa em julienne" },
            { text: "1 unidade de pimenta dedo-de-moça" },
            { text: "1 pedaço pequeno de gengibre fresco ralado" },
            { text: "Folhas de coentro fresco e gelo" }
        ],
        utensils: [
            "Faca de corte fino para peixe",
            "Tábua de corte azul (pescados)",
            "Bowl inox sobre banho de gelo",
            "Espremedor manual de cítricos"
        ]
    },

    // ===== DATADA 4 =====
    {
        id: 7,
        name: "Lasanha à Bolonhesa",
        type: "ITALIANA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-10-19",
        duration: "90 min",
        description: "Clássica lasanha italiana preparada com massa artesanal, ragù à bolonhesa, presunto, queijo e bechamel.",
        ingredients: [
            { text: "500g de massa para lasanha", tag: "Massa" },
            { text: "500g de carne moída", tag: "Carne" },
            { text: "300g de molho de tomate concassé", tag: "Molho" },
            { text: "300g de queijo muçarela", tag: "Queijo" },
            { text: "500ml de molho bechamel" },
            { text: "50g de queijo parmesão ralado" }
        ],
        utensils: [
            "Panela grande para ragù",
            "Travessa refratária retangular",
            "Colher de silicone",
            "Ralador de queijo"
        ]
    },

    // ===== DATADA 5 =====
    {
        id: 9,
        name: "Pão de Queijo Mineiro",
        type: "BRASILEIRA",
        cat: "Panificação",
        status: "datadas",
        dataPrevista: "2026-10-26",
        duration: "40 min",
        description: "Preparação tradicional brasileira feita com polvilho escaldado e queijo meia-cura, crocante por fora e macio por dentro.",
        ingredients: [
            { text: "500g de polvilho doce", tag: "Polvilho" },
            { text: "250ml de leite integral" },
            { text: "100ml de óleo vegetal" },
            { text: "2 unidades de ovos", tag: "Ovos" },
            { text: "250g de queijo meia-cura ralado", tag: "Queijo" },
            { text: "1 colher de chá de sal refinado" }
        ],
        utensils: [
            "Canecão para ferver líquidos",
            "Tigela grande de inox",
            "Assadeira retangular",
            "Forno convencional"
        ]
    },

    // ===== DATADA 6 =====
    {
        id: 11,
        name: "Moqueca Baiana de Peixe",
        type: "BRASILEIRA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-11-02",
        duration: "60 min",
        description: "Peixe cozido em panela de barro com tomates, pimentões, leite de coco e azeite de dendê aromático.",
        ingredients: [
            { text: "800g de filé ou posta de peixe branco", tag: "Pescado" },
            { text: "2 tomates maduros em rodelas", tag: "Hortaliça" },
            { text: "1 cebola grande em rodelas" },
            { text: "1 pimentão vermelho fatiado" },
            { text: "200ml de leite de coco", tag: "Coco" },
            { text: "2 colheres de sopa de azeite de dendê" },
            { text: "Coentro fresco picado a gosto" }
        ],
        utensils: [
            "Panela de barro tradicional",
            "Faca chef afiada",
            "Tábua de corte verde",
            "Colher grande de serviço"
        ]
    },

    // ===== DATADA 7 =====
    {
        id: 15,
        name: "Brioche Trançado de Manteiga",
        type: "FRANCESA",
        cat: "Panificação",
        status: "datadas",
        dataPrevista: "2026-11-09",
        duration: "150 min",
        description: "Massa nobre enriquecida com alta proporção de manteiga e ovos, miolo desfiante e crosta dourada brilhante.",
        ingredients: [
            { text: "500g de farinha de trigo especial (W300)", tag: "Farinha" },
            { text: "5 unidades de ovos médios frios", tag: "Ovos" },
            { text: "250g de manteiga sem sal em ponto pomada", tag: "Laticínio" },
            { text: "60g de açúcar refinado" },
            { text: "10g de fermento biológico seco", tag: "Fermento" },
            { text: "10g de sal fino" }
        ],
        utensils: [
            "Batedeira planetária com gancho",
            "Forma de pão inglês retangular",
            "Pincel culinário macio",
            "Grade de resfriamento"
        ]
    },

    // ===== DATADA 8 =====
    {
        id: 16,
        name: "Carpaccio Clássico com Molho de Alcaparras",
        type: "ITALIANA",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-11-16",
        duration: "20 min",
        description: "Lâminas quase transparentes de carne crua fresca servidas com emulsão de mostarda Dijon, alcaparras e queijo parmesão.",
        ingredients: [
            { text: "300g de filé-mignon bovino limpo", tag: "Carne" },
            { text: "2 colheres de sopa de alcaparras dessalgadas" },
            { text: "1 colher de sopa de mostarda de Dijon" },
            { text: "50ml de azeite de oliva extravirgem" },
            { text: "Suco de 1/2 limão siciliano" },
            { text: "50g de queijo parmesão em lascas", tag: "Queijo" },
            { text: "Folhas de rúcula fresca baby" }
        ],
        utensils: [
            "Faca lisa longa e hiper afiada",
            "Filme plástico alimentar",
            "Prato de servir resfriado",
            "Laminador de queijo"
        ]
    },

    // ===== DATADA 9 =====
    {
        id: 18,
        name: "Baguete Tradicional Francesa",
        type: "FRANCESA",
        cat: "Panificação",
        status: "datadas",
        dataPrevista: "2026-11-23",
        duration: "180 min",
        description: "Pão de casca hiper crocante, miolo com grandes alvéolos irregulares e fermentação com método de pré-fermento poolish.",
        ingredients: [
            { text: "500g de farinha de trigo de força T65", tag: "Farinha" },
            { text: "350ml de água mineral gelada" },
            { text: "5g de fermento biológico seco", tag: "Fermento" },
            { text: "10g de sal refinado" }
        ],
        utensils: [
            "Pano de linho para fermentação (couche)",
            "Lâmina de corte para pão (grignette)",
            "Pá de forno para pão",
            "Pedra refratária de assamento"
        ]
    },

    // ===== DATADA 10 =====
    {
        id: 19,
        name: "Steak Tartare Clássico",
        type: "FRANCESA",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-11-30",
        duration: "25 min",
        description: "Carne bovina crua cortada na ponta da faca em cubos milimétricos, temperada com cebola roxa, alcaparras, mostarda e gema de ovo crua.",
        ingredients: [
            { text: "400g de filé-mignon bovino fresco", tag: "Carne" },
            { text: "1 gema de ovo fresco pasteurizada", tag: "Ovos" },
            { text: "1 colher de sopa de alcaparras picadas" },
            { text: "1 colher de sopa de picles picadinho" },
            { text: "1 colher de chá de molho inglês e tabasco" },
            { text: "1 colher de sopa de mostarda Dijon" }
        ],
        utensils: [
            "Faca chef hiper afiada",
            "Tábua de corte sanitizada",
            "Bowl inox apoiado em banho de gelo",
            "Aro metálico para empratamento"
        ]
    },

    // ===== DATADA 11 =====
    {
        id: 20,
        name: "Polvo Grelhado à Lagareiro",
        type: "PORTUGUESA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-12-04",
        duration: "75 min",
        description: "Tentáculos de polvo tenros cozidos em aromáticos e finalizados na chapa bem quente com azeite fervente, alho dourado e batatas ao murro.",
        ingredients: [
            { text: "1kg de polvo limpo inteiro", tag: "Pescado" },
            { text: "500g de batatas pequenas bolinha", tag: "Tubérculo" },
            { text: "1 cabeça inteira de alho laminado" },
            { text: "150ml de azeite extravirgem de baixa acidez" },
            { text: "Folhas de louro e salsa picada" }
        ],
        utensils: [
            "Panela de pressão para cozimento do polvo",
            "Frigideira ou chapa de ferro pesada",
            "Assadeira para batatas",
            "Pegador longo inox"
        ]
    },

    // ===== DATADA 12 =====
    {
        id: 21,
        name: "Mil-Folhas com Creme Diplomata",
        type: "FRANCESA",
        cat: "Confeitaria",
        status: "datadas",
        dataPrevista: "2026-12-07",
        duration: "110 min",
        description: "Camadas crocantes e caramelizadas de massa folhada invertida recheadas com creme diplomata aerado de baunilha.",
        ingredients: [
            { text: "400g de massa folhada laminada pronta", tag: "Massa" },
            { text: "500ml de leite integral para confeiteiro" },
            { text: "4 unidades de gemas de ovos", tag: "Ovos" },
            { text: "100g de açúcar refinado" },
            { text: "40g de amido de milho" },
            { text: "200ml de creme de leite batido em chantilly", tag: "Laticínio" }
        ],
        utensils: [
            "Assadeira rasa com grelha de peso para folhada",
            "Saco de confeitar com bico liso grande",
            "Faca de serra para pão afiada",
            "Fouet de confeitaria"
        ]
    },

    // ===== DATADA 13 =====
    {
        id: 22,
        name: "Gnocchi de Batata ao Molho Gorgonzola",
        type: "ITALIANA",
        cat: "Cozinha Quente",
        status: "datadas",
        dataPrevista: "2026-12-11",
        duration: "60 min",
        description: "Nhoques levíssimos de batata asterix assada, moldados à mão e envolvidos em molho cremoso de queijo gorgonzola e nozes tostadas.",
        ingredients: [
            { text: "800g de batata asterix assada no sal grosso", tag: "Tubérculo" },
            { text: "150g de farinha de trigo fina", tag: "Farinha" },
            { text: "1 gema de ovo", tag: "Ovos" },
            { text: "200g de queijo gorgonzola dolce", tag: "Queijo" },
            { text: "200ml de creme de leite fresco", tag: "Laticínio" },
            { text: "50g de nozes picadas tostadas" }
        ],
        utensils: [
            "Espremedor manual de batatas",
            "Espátula raspadeira de corte (tarocco)",
            "Gnocchiera (tábua estriada de madeira)",
            "Frigideira sauté grande"
        ]
    },

    // ===== DATADA 14 =====
    {
        id: 23,
        name: "Terrine Campagnarde de Carnes",
        type: "FRANCESA",
        cat: "Cozinha Fria",
        status: "datadas",
        dataPrevista: "2026-12-14",
        duration: "120 min",
        description: "Embutido rústico de charcutaria francesa composto por carnes suínas marinadas em conhaque e ervas, servido frio em fatias.",
        ingredients: [
            { text: "400g de pernil suíno moído grosso", tag: "Carne" },
            { text: "200g de toucinho curado fatiado" },
            { text: "100g de fígado de frango limpo" },
            { text: "50ml de conhaque ou conhaque francês" },
            { text: "Noz-moscada, tomilho e pimenta branca moída" }
        ],
        utensils: [
            "Forma de terrine de ferro fundido ou cerâmica",
            "Tábua de corte sanitizada",
            "Termômetro de espeto culinário",
            "Peso de prensa para resfriamento"
        ]
    },

    // ===== DATADA 15 =====
    {
        id: 24,
        name: "Macarons Clássicos de Framboesa",
        type: "FRANCESA",
        cat: "Confeitaria",
        status: "datadas",
        dataPrevista: "2026-12-18",
        duration: "90 min",
        description: "Casquinhas lisas com saia perfeita à base de merengue italiano e farinha de amêndoas, recheadas com ganache de framboesa.",
        ingredients: [
            { text: "150g de farinha de amêndoas fina", tag: "Amêndoa" },
            { text: "150g de açúcar impalpável de confeiteiro" },
            { text: "110g de claras de ovos envelhecidas", tag: "Ovos" },
            { text: "150g de açúcar refinado para a calda" },
            { text: "150g de chocolate branco com polpa de framboesa" }
        ],
        utensils: [
            "Tapete de silicone com gabarito para macarons",
            "Manga de confeitar com bico redondo 8mm",
            "Termômetro digital para calda de açúcar",
            "Processador / Peneira fina"
        ]
    },


    // ==========================================
    //          15 RECEITAS DISPONÍVEIS
    // ==========================================

    // ===== DISPONÍVEL 1 =====
    {
        id: 1,
        name: "Risoto de Funghi Secchi",
        type: "ITALIANA",
        cat: "Cozinha Quente",
        status: "disponivel",
        dataPrevista: "2026-10-02",
        duration: "45 min",
        description: "Um risoto cremoso italiano que leva funghi secchi reidratados, caldo de legumes e um toque final de manteiga e queijo parmesão.",
        ingredients: [
            { text: "1 xícara de arroz arbóreo", tag: "Grão" },
            { text: "30g de funghi secchi", tag: "Cogumelo" },
            { text: "1L de caldo de legumes quente" },
            { text: "1/2 unidade de cebola picada" },
            { text: "2 colheres de sopa de manteiga", tag: "Laticínio" },
            { text: "1/2 xícara de vinho branco seco" },
            { text: "50g de queijo parmesão ralado", tag: "Queijo" }
        ],
        utensils: [
            "Panela funda antiaderente",
            "Concha média para caldo",
            "Tigela para hidratação de cogumelos",
            "Ralador de queijo fino"
        ]
    },

    // ===== DISPONÍVEL 2 =====
    {
        id: 12,
        name: "Focaccia Tradicional de Alecrim e Flor de Sal",
        type: "ITALIANA",
        cat: "Panificação",
        status: "disponivel",
        dataPrevista: "2026-10-16",
        duration: "90 min",
        description: "Pão de fermentação lenta com alta hidratação, crosta dourada e azeite extravirgem prensado com os dedos formando covinhas.",
        ingredients: [
            { text: "500g de farinha de trigo tipo 1 / 00", tag: "Farinha" },
            { text: "400ml de água morna" },
            { text: "7g de fermento biológico seco", tag: "Fermento" },
            { text: "50ml de azeite de oliva extravirgem" },
            { text: "10g de sal refinado" },
            { text: "Ramos de alecrim fresco e flor de sal" }
        ],
        utensils: [
            "Tigela grande de inox",
            "Raspadeira de padeiro de silicone",
            "Assadeira retangular de borda alta",
            "Pincel culinário"
        ]
    },

    // ===== DISPONÍVEL 3 =====
    {
        id: 6,
        name: "Ratatouille Tradicional",
        type: "FRANCESA",
        cat: "Cozinha Fria",
        status: "disponivel",
        dataPrevista: "2026-10-30",
        duration: "70 min",
        description: "Ensopado clássico francês de vegetais laminados finamente com azeite de oliva e ervas de Provence.",
        ingredients: [
            { text: "1 unidade de berinjela média", tag: "Hortaliça" },
            { text: "2 unidades de abobrinha italiana" },
            { text: "3 tomates italianos maduros" },
            { text: "1 pimentão vermelho sem pele" },
            { text: "2 dentes de alho picados" },
            { text: "1 colher de sopa de ervas finas de Provence" }
        ],
        utensils: [
            "Mandolina fatiadora profissional",
            "Travessa refratária de cerâmica",
            "Papel manteiga vegetal",
            "Faca chef afiada"
        ]
    },

    // ===== DISPONÍVEL 4 =====
    {
        id: 8,
        name: "Bolo de Chocolate",
        type: "CONFEITARIA",
        cat: "Confeitaria",
        status: "disponivel",
        dataPrevista: "2026-11-12",
        duration: "50 min",
        description: "Bolo de chocolate macio e saboroso, ideal para trabalhar técnicas básicas de confeitaria.",
        ingredients: [
            { text: "3 ovos", tag: "Ovos" },
            { text: "2 xícaras de farinha de trigo", tag: "Farinha" },
            { text: "1 xícara de açúcar refinado" },
            { text: "1 xícara de cacau ou chocolate em pó" },
            { text: "1 xícara de leite integral" },
            { text: "1/2 xícara de óleo vegetal" },
            { text: "1 colher de sopa de fermento químico" }
        ],
        utensils: [
            "Fouet de confeitaria",
            "Tigela ampla",
            "Forma redonda para bolo",
            "Espátula de silicone"
        ]
    },

    // ===== DISPONÍVEL 5 =====
    {
        id: 10,
        name: "Salada Caesar Clássica",
        type: "INTERNACIONAL",
        cat: "Cozinha Fria",
        status: "disponivel",
        dataPrevista: "2026-11-25",
        duration: "30 min",
        description: "Salada clássica preparada com folhas frescas de alface romana, croutons, queijo parmesão e molho Caesar.",
        ingredients: [
            { text: "1 pé de alface romana fresca", tag: "Hortaliça" },
            { text: "100g de queijo parmesão", tag: "Queijo" },
            { text: "100g de croutons dourados", tag: "Panificação" },
            { text: "2 colheres de sopa de maionese" },
            { text: "1 dente de alho ralado" },
            { text: "Suco de 1 limão tahiti" }
        ],
        utensils: [
            "Centrífuga secadora de saladas",
            "Bowl amplo de vidro",
            "Ralador de lâminas largas",
            "Faca chef"
        ]
    },

    // ===== DISPONÍVEL 6 =====
    {
        id: 14,
        name: "Crème Brûlée de Baunilha",
        type: "FRANCESA",
        cat: "Confeitaria",
        status: "disponivel",
        dataPrevista: "2026-12-08",
        duration: "60 min",
        description: "Sobremesa francesa sedosa composta por creme de gemas assado em banho-maria e finalizado com açúcar maçaricado.",
        ingredients: [
            { text: "500ml de creme de leite fresco (35% gordura)", tag: "Laticínio" },
            { text: "5 unidades de gemas de ovos", tag: "Ovos" },
            { text: "90g de açúcar refinado" },
            { text: "1 fava de baunilha aberta" },
            { text: "Açúcar cristal para maçaricar" }
        ],
        utensils: [
            "Ramequins individuais rasos",
            "Maçarico culinário portátil",
            "Assadeira alta para banho-maria",
            "Peneira fina metálica"
        ]
    },

    // ===== DISPONÍVEL 7 =====
    {
        id: 17,
        name: "Tartalete de Limão Siciliano com Merengue",
        type: "CONFEITARIA",
        cat: "Confeitaria",
        status: "disponivel",
        dataPrevista: "2026-12-18",
        duration: "75 min",
        description: "Base crocante de massa sablée amanteigada, curd de limão siciliano aveludado e merengue suíço flambado.",
        ingredients: [
            { text: "200g de farinha de trigo especial", tag: "Farinha" },
            { text: "100g de manteiga gelada em cubos", tag: "Laticínio" },
            { text: "70g de açúcar de confeiteiro" },
            { text: "120ml de suco de limão siciliano coado" },
            { text: "4 ovos (gemas e claras separadas)", tag: "Ovos" },
            { text: "120g de açúcar refinado para o merengue" }
        ],
        utensils: [
            "Aro de torta canelado de fundo falso",
            "Manga de confeitar com bico pitanga",
            "Maçarico culinário",
            "Termômetro de calda"
        ]
    },

    // ===== DISPONÍVEL 8 =====
    {
        id: 25,
        name: "Pão Rústico de Fermentação Natural (Sourdough)",
        type: "INTERNACIONAL",
        cat: "Panificação",
        status: "disponivel",
        dataPrevista: "2026-12-22",
        duration: "240 min",
        description: "Pão de casca grossa caramelizada e miolo aerado, feito exclusivamente com levain vivo e longa fermentação a frio.",
        ingredients: [
            { text: "450g de farinha de trigo especial de força", tag: "Farinha" },
            { text: "50g de farinha integral de centeio", tag: "Farinha" },
            { text: "360ml de água mineral sem cloro" },
            { text: "100g de levain ativo no pico", tag: "Fermento" },
            { text: "10g de sal marinho fino" }
        ],
        utensils: [
            "Cesto de fermentação em vime (banneton)",
            "Panela de ferro fundido holandesa com tampa",
            "Lâmina de corte afiada para pão",
            "Termômetro culinário"
        ]
    },

    // ===== DISPONÍVEL 9 =====
    {
        id: 26,
        name: "Tartar de Salmão com Abacate e Azeite Cítrico",
        type: "CONTEMPORÂNEA",
        cat: "Cozinha Fria",
        status: "disponivel",
        dataPrevista: "2026-12-26",
        duration: "20 min",
        description: "Cubos delicados de salmão fresco combinados com abacate maduro em cubos, ciboulette picada e emulsão de limão siciliano.",
        ingredients: [
            { text: "350g de lombo fresco de salmão limpo", tag: "Pescado" },
            { text: "1 unidade de abacate maduro firme", tag: "Fruta" },
            { text: "1 colher de sopa de cebolinha francesa (ciboulette)" },
            { text: "1 colher de chá de azeite de gergelim tostado" },
            { text: "Raspas e suco de 1 limão siciliano" },
            { text: "Flor de sal e pimenta-do-reino moída" }
        ],
        utensils: [
            "Faca de corte fino para sushiman",
            "Tábua de corte azul sanitizada",
            "Aro metálico de montagem (8cm)",
            "Bowl de vidro sobre cama de gelo"
        ]
    },

    // ===== DISPONÍVEL 10 =====
    {
        id: 27,
        name: "Bife Bourguignon Clássico",
        type: "FRANCESA",
        cat: "Cozinha Quente",
        status: "disponivel",
        dataPrevista: "2026-12-29",
        duration: "150 min",
        description: "Cubos de carne bovina braseados lentamente em vinho tinto encorpado com cenouras, cebolinhas pérola, bacon e cogumelos frescos.",
        ingredients: [
            { text: "800g de acém ou músculo bovino em cubos grandes", tag: "Carne" },
            { text: "150g de bacon defumado em tiras grossas" },
            { text: "500ml de vinho tinto seco encorpado", tag: "Bebida" },
            { text: "200g de cogumelos paris frescos", tag: "Cogumelo" },
            { text: "150g de cebolinhas pérola descascadas" },
            { text: "2 cenouras médias em rodelas grossas" },
            { text: "1 bouquet garni (tomilho, louro e salsa)" }
        ],
        utensils: [
            "Cocotte de ferro esmaltada pesada",
            "Pegador longo de carnes",
            "Peneira cônica para molhos",
            "Faca chef de lâmina larga"
        ]
    },

    // ===== DISPONÍVEL 11 =====
    {
        id: 28,
        name: "Éclair Tradicional de Chocolate (Bomba)",
        type: "FRANCESA",
        cat: "Confeitaria",
        status: "disponivel",
        dataPrevista: "2027-01-05",
        duration: "80 min",
        description: "Massa choux oca e sequinha recheada com creme de confeiteiro aveludado e coberta com fondant brilhante de chocolate belga.",
        ingredients: [
            { text: "125ml de água e 125ml de leite integral" },
            { text: "100g de manteiga sem sal em cubos", tag: "Laticínio" },
            { text: "150g de farinha de trigo especial", tag: "Farinha" },
            { text: "4 unidades de ovos médios", tag: "Ovos" },
            { text: "500ml de creme de confeiteiro de chocolate" },
            { text: "150g de chocolate meio amargo para a glaçagem" }
        ],
        utensils: [
            "Panela funda de fundo grosso",
            "Manga de confeitar com bico francês estriado",
            "Tapete de teflon para assar",
            "Batedeira planetária"
        ]
    },

    // ===== DISPONÍVEL 12 =====
    {
        id: 29,
        name: "Ciabatta Rústica de Alta Hidratação",
        type: "ITALIANA",
        cat: "Panificação",
        status: "disponivel",
        dataPrevista: "2027-01-09",
        duration: "130 min",
        description: "Pão tradicional italiano achatado com 82% de hidratação, casca fina super crocante e miolo repleto de bolhas de ar.",
        ingredients: [
            { text: "500g de farinha de trigo forte para panificação", tag: "Farinha" },
            { text: "410ml de água mineral gelada" },
            { text: "5g de fermento biológico seco instantâneo", tag: "Fermento" },
            { text: "15ml de azeite de oliva extravirgem" },
            { text: "10g de sal refinado" }
        ],
        utensils: [
            "Caixa fermentadora retangular plástica untada",
            "Pá plana para pão enfarinhada",
            "Raspadeira de corte de metal",
            "Pedra refratária de forno"
        ]
    },

    // ===== DISPONÍVEL 13 =====
    {
        id: 30,
        name: "Gaspacho Andaluz Tradicional",
        type: "ESPANHOLA",
        cat: "Cozinha Fria",
        status: "disponivel",
        dataPrevista: "2027-01-13",
        duration: "20 min",
        description: "Sopa fria refrescante típica do sul da Espanha elaborada à base de tomates maduros, pepino, pimentão e azeite extravirgem batidos.",
        ingredients: [
            { text: "1kg de tomates maduros tipo pera", tag: "Hortaliça" },
            { text: "1 pepino japonês médio sem sementes" },
            { text: "1 pimentão verde italiano" },
            { text: "1 dente de alho pequeno sem o gérmen" },
            { text: "50g de pão amanhecido hidratado em vinagre de jerez" },
            { text: "100ml de azeite extravirgem espanhol" }
        ],
        utensils: [
            "Liquidificador de alta potência",
            "Peneira metálica média (chinois)",
            "Jarra de vidro mantida na geladeira",
            "Tábua de corte verde"
        ]
    },

    // ===== DISPONÍVEL 14 =====
    {
        id: 31,
        name: "Bacalhau à Brás Clássico",
        type: "PORTUGUESA",
        cat: "Cozinha Quente",
        status: "disponivel",
        dataPrevista: "2027-01-17",
        duration: "40 min",
        description: "Desfiado de bacalhau nobre refogado em cebolas e alho, envolvido em ovos batidos cremosos e batata palha artesanal fininha.",
        ingredients: [
            { text: "400g de lombo de bacalhau dessalgado desfiado", tag: "Pescado" },
            { text: "300g de batata asterix cortada em palha fininha", tag: "Tubérculo" },
            { text: "5 ovos inteiros frescos batidos levemente", tag: "Ovos" },
            { text: "2 cebolas médias cortadas em meia-lua fina" },
            { text: "Azeitonas pretas portuguesas e salsa picada" },
            { text: "50ml de azeite de oliva virgem" }
        ],
        utensils: [
            "Frigideira grande de ferro ou inox",
            "Mandolina para batata palha",
            "Fritadeira ou panela funda para fritura",
            "Garfo grande para envolver ovos"
        ]
    },

    // ===== DISPONÍVEL 15 =====
    {
        id: 32,
        name: "Cannoli Siciliani com Ricota e Pistache",
        type: "ITALIANA",
        cat: "Confeitaria",
        status: "disponivel",
        dataPrevista: "2027-01-21",
        duration: "60 min",
        description: "Canudos crocantes e borbulhantes de massa frita aromatizada com vinho Marsala, recheados na hora com creme de ricota de ovelha e pistaches.",
        ingredients: [
            { text: "200g de farinha de trigo especial", tag: "Farinha" },
            { text: "20g de banha ou manteiga", tag: "Gordura" },
            { text: "30ml de vinho Marsala doce", tag: "Bebida" },
            { text: "400g de ricota fresca drenada de soro", tag: "Queijo" },
            { text: "120g de açúcar de confeiteiro" },
            { text: "50g de pistache cru picado para decorar", tag: "Oleaginosa" }
        ],
        utensils: [
            "Canudos cilíndricos metálicos para fritura de cannoli",
            "Rolo de massa / Cilindro manual",
            "Cortador redondo de massa (10cm)",
            "Manga de confeitar com bico liso"
        ]
    }
];


// ===== ESTADO GLOBAL (Sincronizado com o botão ativo no HTML) =====
const btnAtivoHtml = document.querySelector('.status-tab-btn.active');
let activeStatus = btnAtivoHtml ? (btnAtivoHtml.dataset.status || 'datadas') : 'datadas';
let activeCategories = [];
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

// ===== FILTRO POR TIPO DE RECEITA =====
const categoryTabs = document.getElementById('categoryTabs');


if (categoryTabs) {
    const tipos = [...new Set(
        RECIPES.map(r => r.type).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    categoryTabs.innerHTML = `
    <div class="multi-select">
        <div class="multi-select-box" id="categoryMultiSelect">
            <span class="multi-select-placeholder">Selecione as categorias</span>
            <span class="multi-select-arrow">▼</span>
        </div>

        <div class="multi-select-options" id="categoryOptions">
            ${tipos.map(tipo => `
                <label class="multi-select-option">
                    <input type="checkbox" value="${tipo}">
                    <span>${tipo.charAt(0) + tipo.slice(1).toLowerCase()}</span>
                </label>
            `).join('')}
        </div>
    </div>
`;
    const multiSelect = document.getElementById('categoryMultiSelect');
    const categoryOptions = document.getElementById('categoryOptions');

    multiSelect.addEventListener('click', () => {
        categoryOptions.classList.toggle('show');
    });

    categoryOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            activeCategories = [...categoryOptions.querySelectorAll('input:checked')]
                .map(input => input.value);

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
        .filter(r => activeCategories.length === 0 || activeCategories.includes(r.type))
        .filter(r => {
            if (!searchTerm) return true;
            const matchName = r.name.toLowerCase().includes(searchTerm);
            const matchIng = r.ingredients.some(i => i.text.toLowerCase().includes(searchTerm));
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


// ===== INICIALIZAR LISTA =====
renderList();