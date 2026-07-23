// ===== ENTIDADES DE TURMA (igual ao scriptHome.js) =====
const turmas = {
    "2024.1.A": { nome: "Turma 2024.1.A", cozinha: "Padaria Lab 01" },
    "2024.1.C": { nome: "Turma 2024.1.C", cozinha: "Cozinha Pedagógica 02" },
    "2024.2.N": { nome: "Turma 2024.2.N", cozinha: "Cozinha Pedagógica 04" }
};

let turmaAtual = "2024.1.A"; // turma selecionada por padrão

const turmaSelect = document.getElementById('turma-select');

// Popula o <select> com o mesmo formato usado na Home: "Nome — Cozinha"
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

// ===== ESTILOS INJETADOS (grid Ingredientes + Utensílios lado a lado) =====
(function injectRecipeDetailStyles() {
    if (document.getElementById('receitas-extra-styles')) return;
    const style = document.createElement('style');
    style.id = 'receitas-extra-styles';
    style.textContent = `
        .ingredientes-utensilios-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            align-items: start;
        }
        .ingredientes-utensilios-grid .coluna-bloco .block-title {
            margin-top: 0;
        }
        @media (max-width: 768px) {
            .ingredientes-utensilios-grid {
                grid-template-columns: 1fr;
                gap: 8px;
            }
        }
    `;
    document.head.appendChild(style);
})();

// ===== RECEITAS =====
const RECIPES = [
    {
        id:1, name:"Risoto de Funghi", cat:"Italiana", serves:"4 porções",
        status:"disponivel",
        description:"Um risoto cremoso italiano que leva funghi secchi reidratados, caldo de legumes e um toque final de manteiga e queijo parmesão. Ideal para um jantar especial.",
        ingredients:["1 xícara de arroz arbóreo","30g de funghi secchi","1L de caldo de legumes","1/2 cebola picada","2 colheres de manteiga","1/2 xícara de vinho branco","50g de queijo parmesão ralado","Sal e pimenta a gosto"],
        utensils:["Panela funda antiaderente","Colher de pau","Concha","Tigela para hidratar o funghi","Ralador de queijo","Faca e tábua de corte"],
        steps:[
            {title:"Hidrate o funghi", text:"Deixe o funghi secchi de molho em água morna por 20 minutos. Escorra e pique."},
            {title:"Refogue a cebola", text:"Em uma panela, derreta 1 colher de manteiga e refogue a cebola até ficar transparente."},
            {title:"Toste o arroz", text:"Adicione o arroz arbóreo e mexa por 2 minutos até ficar levemente translúcido."},
            {title:"Deglaceie com vinho", text:"Adicione o vinho branco e mexa até evaporar completamente."},
            {title:"Cozinhe adicionando caldo aos poucos", text:"Adicione o caldo quente em conchas, mexendo sempre, até o arroz absorver antes de adicionar mais."},
            {title:"Finalize", text:"Fora do fogo, adicione a manteiga restante e o parmesão. Misture bem e sirva imediatamente."}
        ]
    },
    {
        id:2, name:"Feijoada Completa", cat:"Brasileira", serves:"8 porções",
        status:"disponivel",
        description:"Prato típico brasileiro à base de feijão preto cozido lentamente com carnes defumadas e salgadas, servido tradicionalmente com arroz, couve e farofa.",
        ingredients:["500g de feijão preto","300g de carne seca","200g de linguiça calabresa","200g de costelinha de porco","2 folhas de louro","1 cebola picada","4 dentes de alho","Sal e pimenta a gosto"],
        utensils:["Panela de pressão","Panela grande de fundo grosso","Faca de chef","Tábua de corte","Escumadeira","Tigela grande para dessalgue"],
        steps:[
            {title:"Dessalgue as carnes", text:"Deixe a carne seca de molho, trocando a água algumas vezes, por 12 horas.", time:"12h"},
            {title:"Cozinhe o feijão", text:"Cozinhe o feijão preto na panela de pressão até ficar macio.", time:"40 min"},
            {title:"Doure as carnes", text:"Em uma panela grande, doure a linguiça e a costelinha.", time:"15 min"},
            {title:"Junte tudo", text:"Adicione o feijão cozido, a carne seca desfiada, louro, cebola e alho. Cozinhe em fogo baixo.", time:"1h30"},
            {title:"Finalize e sirva", text:"Ajuste o sal, retire o excesso de gordura e sirva com arroz branco, couve refogada e farofa.", time:"10 min"}
        ]
    },
    {
        id:3, name:"Sushi de Salmão", cat:"Japonesa", serves:"2 porções",
        status:"datadas",
        description:"Sushi tradicional japonês com arroz temperado, salmão fresco e alga nori, enrolado e cortado em peças elegantes.",
        ingredients:["2 xícaras de arroz para sushi","3 colheres de vinagre de arroz","200g de salmão fresco","4 folhas de alga nori","Molho shoyu","Gengibre em conserva","Wasabi"],
        utensils:["Esteira de bambu (makisu)","Faca afiada tipo santoku","Tigela grande para o arroz (hangiri)","Pano de prato umedecido","Tábua de corte"],
        steps:[
            {title:"Prepare o arroz", text:"Cozinhe o arroz e tempere com vinagre de arroz, açúcar e sal ainda quente.", time:"20 min"},
            {title:"Corte o salmão", text:"Corte o salmão fresco em tiras finas e uniformes.", time:"5 min"},
            {title:"Monte os rolinhos", text:"Espalhe o arroz sobre a alga nori, adicione o salmão e enrole com a esteira de bambu.", time:"15 min"},
            {title:"Corte e sirva", text:"Corte os rolinhos em peças iguais e sirva com shoyu, gengibre e wasabi.", time:"5 min"}
        ]
    },
    {
        id:4, name:"Curry Vegano de Grão-de-bico", cat:"Vegana", serves:"4 porções",
        status:"disponivel",
        description:"Curry cremoso e reconfortante feito com leite de coco, grão-de-bico e especiarias indianas, perfeito para uma refeição vegana rápida.",
        ingredients:["2 latas de grão-de-bico cozido","1 lata de leite de coco","1 cebola picada","2 dentes de alho","1 colher de curry em pó","1 colher de páprica","Coentro fresco","Sal a gosto"],
        utensils:["Panela média","Colher de pau","Faca e tábua de corte","Abridor de latas","Colher de medida"],
        steps:[
            {title:"Refogue os aromáticos", text:"Refogue a cebola e o alho até dourarem levemente.", time:"5 min"},
            {title:"Adicione as especiarias", text:"Junte o curry em pó e a páprica, mexendo por 1 minuto para liberar o aroma.", time:"2 min"},
            {title:"Adicione o grão-de-bico e o leite de coco", text:"Misture bem e deixe cozinhar em fogo médio-baixo.", time:"20 min"},
            {title:"Finalize", text:"Ajuste o sal, finalize com coentro fresco picado e sirva com arroz basmati.", time:"8 min"}
        ]
    },
    {
        id:5, name:"Tacos de Carnitas", cat:"Mexicana", serves:"4 porções",
        status:"disponivel",
        description:"Tacos mexicanos com carne de porco desfiada e levemente crocante, servidos em tortilhas quentes com pico de gallo e limão.",
        ingredients:["600g de carne de porco","1 laranja (suco)","2 dentes de alho","1 colher de cominho","Tortillas de milho","Cebola roxa picada","Coentro fresco","Limão"],
        utensils:["Panela grande com tampa","Frigideira","Faca de chef","Tábua de corte","Espremedor de citrinos","Dois garfos (para desfiar)"],
        steps:[
            {title:"Tempere a carne", text:"Tempere a carne de porco com sal, cominho e alho amassado.", time:"10 min"},
            {title:"Cozinhe lentamente", text:"Cozinhe a carne com suco de laranja em fogo baixo até ficar bem macia.", time:"40 min"},
            {title:"Desfie e doure", text:"Desfie a carne e leve à frigideira quente para dourar as bordas.", time:"8 min"},
            {title:"Monte os tacos", text:"Sirva a carne em tortillas quentes com cebola roxa, coentro e limão.", time:"5 min"}
        ]
    },
    {
        id:6, name:"Ratatouille", cat:"Francesa", serves:"4 porções",
        status:"datadas",
        description:"Ensopado clássico francês de vegetais como abobrinha, berinjela e tomate, cozidos lentamente com ervas provençais.",
        ingredients:["1 berinjela","2 abobrinhas","2 tomates","1 pimentão","1 cebola","2 dentes de alho","Ervas de Provence","Azeite de oliva"],
        utensils:["Faca de chef","Tábua de corte","Mandolina (opcional, para fatias uniformes)","Assadeira ou travessa refratária","Papel alumínio"],
        steps:[
            {title:"Corte os vegetais", text:"Corte todos os vegetais em fatias finas e uniformes.", time:"15 min"},
            {title:"Refogue a base", text:"Refogue cebola e alho no azeite até perfumar.", time:"5 min"},
            {title:"Monte em camadas", text:"Disponha as fatias de vegetais alternadas sobre a base de tomate.", time:"10 min"},
            {title:"Asse lentamente", text:"Leve ao forno coberto com papel alumínio até os vegetais ficarem macios.", time:"25 min"}
        ]
    },
    {
        id:7, name:"Lasanha à Bolonhesa", cat:"Italiana", serves:"6 porções",
        status:"disponivel",
        description:"Camadas de massa fresca, molho bolonhesa encorpado e um generoso creme de queijo, gratinados até dourar por cima.",
        ingredients:["500g de massa de lasanha","500g de carne moída","400g de molho de tomate","1 cebola picada","2 dentes de alho","500ml de molho branco (bechamel)","200g de queijo mussarela ralado","50g de queijo parmesão","Sal e orégano a gosto"],
        utensils:["Panela para o molho","Frigideira grande","Assadeira retangular","Colher de pau","Ralador de queijo","Papel alumínio"],
        steps:[
            {title:"Prepare o molho bolonhesa", text:"Refogue cebola e alho, adicione a carne moída e doure. Junte o molho de tomate e cozinhe em fogo baixo.", time:"25 min"},
            {title:"Prepare o bechamel", text:"Derreta manteiga, adicione farinha e leite aos poucos, mexendo até engrossar.", time:"15 min"},
            {title:"Monte as camadas", text:"Alterne camadas de massa, molho bolonhesa e bechamel na assadeira, finalizando com queijo.", time:"15 min"},
            {title:"Asse", text:"Cubra com papel alumínio e leve ao forno preaquecido; retire o papel nos últimos minutos para gratinar.", time:"40 min"},
            {title:"Finalize", text:"Deixe descansar antes de cortar e servir.", time:"10 min"}
        ]
    },
    {
        id:8, name:"Moqueca de Peixe", cat:"Brasileira", serves:"4 porções",
        status:"disponivel",
        description:"Ensopado baiano de peixe cozido em leite de coco, dendê e pimentões coloridos, com aroma marcante de coentro.",
        ingredients:["600g de filé de peixe branco","2 tomates picados","1 pimentão vermelho","1 pimentão amarelo","1 cebola em rodelas","200ml de leite de coco","2 colheres de azeite de dendê","Coentro fresco","Suco de limão","Sal a gosto"],
        utensils:["Panela de barro ou panela larga","Faca de chef","Tábua de corte","Colher de pau","Espremedor de limão"],
        steps:[
            {title:"Tempere o peixe", text:"Tempere os filés com sal e limão e deixe marinar.", time:"15 min"},
            {title:"Monte as camadas", text:"Em uma panela, disponha camadas de cebola, tomate, pimentões e o peixe.", time:"10 min"},
            {title:"Cozinhe com leite de coco", text:"Adicione o leite de coco e o azeite de dendê, cozinhando em fogo médio sem mexer muito para não desmanchar o peixe.", time:"20 min"},
            {title:"Finalize", text:"Salpique coentro fresco picado e sirva com arroz branco e pirão.", time:"5 min"}
        ]
    },
    {
        id:9, name:"Pad Thai de Camarão", cat:"Tailandesa", serves:"3 porções",
        status:"disponivel",
        description:"Macarrão de arroz salteado no wok com camarões, ovos, broto de feijão e um molho agridoce típico da culinária tailandesa.",
        ingredients:["200g de macarrão de arroz (pad thai)","250g de camarão limpo","2 ovos","2 colheres de molho de peixe","2 colheres de molho tamarindo","1 colher de açúcar mascavo","Broto de feijão","Cebolinha picada","Amendoim torrado picado","Limão"],
        utensils:["Wok","Escumadeira","Tigela para hidratar o macarrão","Faca e tábua de corte","Pilão (para o amendoim)"],
        steps:[
            {title:"Hidrate o macarrão", text:"Deixe o macarrão de arroz de molho em água morna até ficar maleável.", time:"15 min"},
            {title:"Prepare o molho", text:"Misture molho de peixe, molho tamarindo e açúcar mascavo em uma tigela.", time:"5 min"},
            {title:"Salteie no wok", text:"No wok bem quente, salteie o camarão até dourar, adicione o ovo mexido e depois o macarrão.", time:"10 min"},
            {title:"Finalize", text:"Junte o molho, o broto de feijão e a cebolinha. Sirva com amendoim picado e limão.", time:"5 min"}
        ]
    },
    {
        id:10, name:"Paella de Frutos do Mar", cat:"Espanhola", serves:"6 porções",
        status:"disponivel",
        description:"Clássico prato espanhol de arroz socarrat cozido em caldo de frutos do mar, açafrão e pimentões, coberto com camarões, mexilhões e lulas.",
        ingredients:["2 xícaras de arroz para paella","300g de camarão","200g de mexilhões","200g de lula em anéis","1 pimentão vermelho","1 tomate ralado","1 cebola picada","Açafrão em pó","1L de caldo de peixe","Azeite de oliva"],
        utensils:["Paellera (ou frigideira larga e rasa)","Colher de pau","Faca e tábua de corte","Concha"],
        steps:[
            {title:"Refogue a base", text:"Refogue cebola, pimentão e tomate ralado no azeite até formar um sofrito.", time:"10 min"},
            {title:"Doure os frutos do mar", text:"Doure rapidamente o camarão e a lula, reserve.", time:"8 min"},
            {title:"Cozinhe o arroz", text:"Adicione o arroz e o açafrão ao sofrito, regue com o caldo quente aos poucos sem mexer.", time:"20 min"},
            {title:"Finalize", text:"Distribua os frutos do mar reservados e os mexilhões sobre o arroz, cozinhando até formar o socarrat no fundo.", time:"10 min"}
        ]
    },
    // ===== NOVAS RECEITAS ADICIONADAS (11 a 35) =====
    {
        id:11, name:"Strogonoff de Frango", cat:"Brasileira", serves:"4 porções",
        status:"disponivel",
        description:"Típico prato do dia a dia brasileiro, feito com peito de frango em tiras, molho cremoso de creme de leite, catchup, mostarda e cogumelos.",
        ingredients:["1kg de peito de frango em cubos","1 caixa de creme de leite","2 colheres de catchup","1 colher de mostarda","100g de cogumelo champignon","1 cebola picada","2 dentes de alho","Sal, pimenta e azeite"],
        utensils:["Frigideira grande ou panela funda","Tábua de corte","Faca de chef","Colher de pau"],
        steps:[
            {title:"Dourar o frango", text:"Tempere o frango com sal e pimenta e doure na frigideira com azeite."},
            {title:"Refogar aromáticos", text:"Adicione a cebola, o alho e os cogumelos fatiados e refogue até amolecer."},
            {title:"Adicionar molhos", text:"Incorpore o catchup, a mostarda e mexa bem."},
            {title:"Finalizar com creme de leite", text:"Desligue o fogo e misture o creme de leite suavemente. Sirva com arroz e batata palha."}
        ]
    },
    {
        id:12, name:"Gnocchi ao Molho Pesto", cat:"Italiana", serves:"3 porções",
        status:"disponivel",
        description:"Nhoque de batata artesanal servido com molho pesto tradicional de manjericão, nozes, alho e azeite extravirgem.",
        ingredients:["500g de nhoque de batata","1 xícara de manjericão fresco","1/2 xícara de azeite extravirgem","1/2 xícara de parmesão ralado","1/4 xícara de nozes ou pinoli","1 dente de alho","Sal a gosto"],
        utensils:["Processador ou liquidificador","Panela grande para cozimento","Escumadeira","Tigela para servir"],
        steps:[
            {title:"Preparo do Pesto", text:"Bata o manjericão, nozes, alho, azeite e parmesão no processador até virar uma pasta."},
            {title:"Cozimento da massa", text:"Ferva bastante água salgada e jogue o nhoque."},
            {title:"Retirar ao subir", text:"Quando os nhoques boiarem, retire-os imediatamente com uma escumadeira."},
            {title:"Misturar", text:"Envolva os nhoques delicadamente no molho pesto e sirva."}
        ]
    },
    {
        id:13, name:"Ceviche Tradicional", cat:"Peruana", serves:"2 porções",
        status:"disponivel",
        description:"Prato leve de peixe fresco marinando no suco de limão (leche de tigre) com cebola roxa, pimenta dedo-de-moça e coentro.",
        ingredients:["400g de peixe branco fresco (pargo ou tilápia)","Suco de 6 limões","1 cebola roxa fatiada bem fina","1 pimenta dedo-de-moça picada","Coentro picado","1 milho cozido","Coentro e sal a gosto"],
        utensils:["Tigela de vidro ou inox","Faca afiada","Tábua de corte","Espremedor de limão"],
        steps:[
            {title:"Corte do peixe", text:"Corte o peixe em cubos médios uniformes."},
            {title:"Marinada", text:"Em uma tigela fria, junte o peixe, o sal, a pimenta e cubra com o suco de limão recém-espremido."},
            {title:"Incorporar cebola", text:"Misture a cebola roxa e o coentro picado, deixando marinar por 5 minutos."},
            {title:"Servir", text:"Sirva imediatamente acompanhado de rodelas de milho ou batata-doce cozida."}
        ]
    },
    {
        id:14, name:"Hambúrguer Artesanal", cat:"Americana", serves:"2 porções",
        status:"disponivel",
        description:"Sculpted burger juicy de fraldinha e acém no pão brioche com queijo cheddar derretido e molho especial.",
        ingredients:["300g de fraldinha moída com 20% de gordura","2 fatias de queijo cheddar","2 pães de hambúrguer tipo brioche","Manteiga para selar o pão","Sal e pimenta-do-reino"],
        utensils:["Frigideira de ferro ou chapa","Espátula de metal","Pincel culinário"],
        steps:[
            {title:"Modelagem", text:"Divida a carne em 2 bolotas de 150g e molde no formato de hambúrguer sem apertar muito."},
            {title:"Selar o pão", text:"Passe manteiga no pão e doure na frigideira bem quente."},
            {title:"Grelhar a carne", text:"Tempere a carne com sal e pimenta logo antes de colocar na frigideira fumegante. Deixe 3 min de cada lado."},
            {title:"Derreter queijo", text:"Coloque o queijo cheddar por cima, abafe por 1 min e monte no pão."}
        ]
    },
    {
        id:15, name:"Falafel com Molho Tarator", cat:"Árabe", serves:"4 porções",
        status:"disponivel",
        description:"Bolinhos crocantes de grão-de-bico frito com ervas e especiarias, acompanhados de molho leve de tahine.",
        ingredients:["250g de grão-de-bico cru (de molho por 12h)","1/2 xícara de salsinha e coentro","1 cebola pequena","3 dentes de alho","1 colher de cominho em pó","1 colher de fermento químico","Óleo para fritar"],
        utensils:["Processador de alimentos","Colher ou moldador de falafel","Escumadeira","Panela funda para fritura"],
        steps:[
            {title:"Processar ingredientes", text:"Bata o grão-de-bico cru drenado com alho, cebola, ervas e cominho no processador até virar uma pasta granulada."},
            {title:"Moldar", text:"Adicione o fermento, misture e molde pequenos discos ou bolinhas."},
            {title:"Fritura", text:"Frite em óleo bem quente até que fiquem bem dourados e crocantes."},
            {title:"Servir", text:"Escorra em papel absorvente e sirva com molho de tahine e pão sírio."}
        ]
    },
    {
        id:16, name:"Shakshuka", cat:"Árabe", serves:"2 porções",
        status:"disponivel",
        description:"Ovos cozidos lentamente em um rico molho de tomate pimentão e pimenta, aromatizado com cominho e páprica.",
        ingredients:["4 ovos","1 lata de tomate pelado","1 pimentão vermelho picado","1 cebola picada","2 dentes de alho","1 colher de páprica defumada","Azeite, sal e coentro"],
        utensils:["Frigideira grande de ferro com tampa","Colher de pau","Faca de chef"],
        steps:[
            {title:"Base do molho", text:"Refogue a cebola, o alho e o pimentão no azeite até dourarem."},
            {title:"Cozinhar molho", text:"Adicione a páprica e o tomate pelado, esmagando-os. Deixe encorpar por 10 minutos."},
            {title:"Adicionar ovos", text:"Abra pequenas cavidades no molho e quebre os ovos dentro delas."},
            {title:"Abafar", text:"Abafe com a tampa até que as claras estejam cozidas e as gemas moles. Polvilhe coentro."}
        ]
    },
    {
        id:17, name:"Sopa Onion Gratinée", cat:"Francesa", serves:"4 porções",
        status:"datadas",
        description:"Sopa de cebola caramelizada em caldo saboroso, coberta com fatia de pão francês e queijo gruyère gratinado.",
        ingredients:["4 cebolas grandes fatiadas","50ml de vinho branco","1L de caldo de carne","50g de manteiga","Fatias de pão baguete","200g de queijo gruyère ou suíço ralado"],
        utensils:["Panela funda de fundo grosso","Cumbucas/Ramekins que vão ao forno","Ralador"],
        steps:[
            {title:"Caramelizar cebolas", text:"Cozinhe as cebolas na manteiga em fogo baixo por cerca de 30-40 min até ficarem bem escuras e doces."},
            {title:"Deglacê e caldo", text:"Adicione o vinho branco para soltar o fundo da panela, junte o caldo de carne e ferva por 20 min."},
            {title:"Montagem", text:"Coloque a sopa nas cumbucas, ponha uma fatia de pão por cima e cubra generosamente com queijo."},
            {title:"Gratinar", text:"Leve ao forno em temperatura máxima até o queijo borbulhar e dourar."}
        ]
    },
    {
        id:18, name:"Guacamole Clássico", cat:"Mexicana", serves:"4 porções",
        status:"disponivel",
        description:"Entrada mexicana refrescante de abacate amassado temperado com limão, tomate, cebola roxa, coentro e pimenta.",
        ingredients:["2 abacates maduros (ou avocados)","1 tomate sem semente picado","1/2 cebola roxa bem picada","Suco de 1 limão","Coentro fresco picado","Sal a gosto"],
        utensils:["Garfo ou pilão (molcajete)","Tigela","Faca de chef"],
        steps:[
            {title:"Amasse o abacate", text:"Abra os abacates, retire o caroço e amasse a polpa com um garfo deixando alguns pedaços."},
            {title:"Temperar", text:"Misture imediatamente o suco de limão para evitar a oxidação."},
            {title:"Incorporar ingredientes", text:"Adicione o tomate, a cebola roxa, o coentro e o sal."},
            {title:"Servir", text:"Misture delicadamente e sirva acompanhado de nachos de milho."}
        ]
    },
    {
        id:19, name:"Tiramisù Clássico", cat:"Italiana", serves:"6 porções",
        status:"disponivel",
        description:"Sobremesa italiana refrescante feita com camadas de biscoito champagne embebido em café e creme leve de mascarpone.",
        ingredients:["300g de queijo mascarpone","3 gemas","1/2 xícara de açúcar","1 xícara de café forte sem açúcar","1 pacote de biscoito champagne","Cau em pó para polvilhar"],
        utensils:["Batedeira","Travessa retangular","Peneira fina"],
        steps:[
            {title:"Bater o creme", text:"Bata as gemas com o açúcar até formar um creme claro, depois adicione o mascarpone até incorporar."},
            {title:"Camada de biscoitos", text:"Passe os biscoitos rapidamente pelo café frio e faça uma camada no fundo da travessa."},
            {title:"Montagem", text:"Cubra com metade do creme de mascarpone. Repita a camada de biscoito e finalize com o creme."},
            {title:"Refrigerar", text:"Leve à geladeira por 4 horas e polvilhe cacau em pó antes de servir."}
        ]
    },
    {
        id:20, name:"Yakisoba de Carne e Legumes", cat:"Japonesa", serves:"4 porções",
        status:"disponivel",
        description:"Macarrão frito salteado com tiras de carne, acelga, brócolis, cenoura e molho denso à base de shoyu.",
        ingredients:["300g de macarrão para yakisoba","300g de alcatra em tiras","1 cenoura fatiada","1/2 maço de brócolis","2 xícaras de acelga picada","1/2 xícara de molho shoyu","1 colher de óleo de gergelim"],
        utensils:["Wok ou frigideira bem grande","Panela para cozinhar o macarrão","Colher de pau"],
        steps:[
            {title:"Cozinhar o macarrão", text:"Cozinhe o macarrão até ficar al dente e escorra."},
            {title:"Saltear a carne", text:"Doure a carne na wok quente e reserve."},
            {title:"Cozinhar legumes", text:"Na mesma wok, salteie a cenoura, o brócolis e a acelga até ficarem 'al dente'."},
            {title:"Misturar", text:"Volte a carne, junte o macarrão, regue com shoyu e óleo de gergelim e misture vigorosamente."}
        ]
    },
    {
        id:21, name:"Coxinha de Frango com Catupiry", cat:"Brasileira", serves:"10 porções",
        status:"disponivel",
        description:"O salgado mais amado do Brasil: massa leve de caldo de galinha recheada com frango desfiado temperado e requeijão cremoso.",
        ingredients:["2 xícaras de caldo de galinha","2 xícaras de farinha de trigo","1 colher de manteiga","300g de frango desfiado temperado","100g de requeijão tipo catupiry","Farinha de rosca e ovo para empanar"],
        utensils:["Panela média","Tábua para sovar","Prato funda para empanar","Panela para fritura"],
        steps:[
            {title:"Fazer a massa", text:"Ferva o caldo com a manteiga. Adicione a farinha de uma vez e mexa até soltar do fundo da panela."},
            {title:"Sovar", text:"Deixe a massa mornar e sove até ficar lisa."},
            {title:"Modelar", text:"Abra porções da massa na mão, recheie com frango e catupiry e feche no formato de gota."},
            {title:"Empanar e fritar", text:"Passe no ovo, na farinha de rosca e frite em óleo bem quente."}
        ]
    },
    {
        id:22, name:"Salada Caprese", cat:"Italiana", serves:"2 porções",
        status:"disponivel",
        description:"Salada fresca e rápida com as cores da bandeira da Itália: tomate, muçarela de búfala e manjericão.",
        ingredients:["2 tomates maduros mas firmes","200g de muçarela de búfala em rodelas","Folhas de manjericão fresco","Azeite extravirgem","Redução de vinagre balsâmico (opcional)","Sal e pimenta moída"],
        utensils:["Faca de serra para tomate","Prato raso para apresentação"],
        steps:[
            {title:"Fatiar", text:"Corte os tomates e a muçarela de búfala em fatias de espessura similar."},
            {title:"Dispor", text:"Alterne fatias de tomate, muçarela e folhas de manjericão em um prato raso."},
            {title:"Temperar", text:"Regue generosamente com azeite extravirgem, sal, pimenta e aceto balsâmico."}
        ]
    },
    {
        id:23, name:"Quiche Lorraine", cat:"Francesa", serves:"6 porções",
        status:"datadas",
        description:"Torta aberta clássica da culinária francesa feita com massa podre crocante e recheio de bacon, queijo e creme de leite.",
        ingredients:["200g de farinha de trigo","100g de manteiga gelada","150g de bacon em cubos","3 ovos","200ml de creme de leite fresco","100g de queijo gruyère ralado","Noz-moscada"],
        utensils:["Forma de fundo removível","Frigideira","Tigela para bater os ovos","Rolo de massa"],
        steps:[
            {title:"Massa podre", text:"Misture a farinha e a manteiga com a ponta dos dedos até virar uma farofa, junte um pouco de água fria e molde. Asse a base por 10 min."},
            {title:"Fritar bacon", text:"Frite o bacon até ficar crocante e escorra a gordura."},
            {title:"Creme royale", text:"Bata os ovos com creme de leite, noz-moscada, sal e o queijo."},
            {title:"Asse", text:"Espalhe o bacon na massa pré-assada, despeje o creme por cima e asse a 180°C por 30 minutos."}
        ]
    },
    {
        id:24, name:"Ceviche de Banana-da-Terra", cat:"Vegana", serves:"3 porções",
        status:"disponivel",
        description:"Uma versão vegana e inovadora do ceviche, utilizando banana-da-terra cozida com o mesmo toque cítrico e refrescante.",
        ingredients:["2 bananas-da-terra firmes","Suco de 3 limões","1/2 pimentão vermelho picadinho","1/2 cebola roxa em tiras","Coentro fresco picado","Azeite de oliva e sal"],
        utensils:["Panela para cozinhar a banana","Tigela de vidro","Faca e tábua de corte"],
        steps:[
            {title:"Cozinhar a banana", text:"Cozinhe as bananas com casca em água por 10 minutos. Deixe esfriar, descasque e corte em rodelas ou cubos."},
            {title:"Misturar temperos", text:"Junte a cebola roxa, o pimentão, o coentro e regue com o suco de limão."},
            {title:"Marinar", text:"Deixe na geladeira por 20 minutos para pegar o sabor e sirva gelado."}
        ]
    },
    {
        id:25, name:"Bruschetta de Tomate e Manjericão", cat:"Italiana", serves:"4 porções",
        status:"disponivel",
        description:"Entrada simples e deliciosa feita com pão italiano torrado, alho fresco, tomate picado, azeite e manjericão.",
        ingredients:["1 pão italiano fatiado","3 tomates maduros sem sementes picados","2 dentes de alho","1/2 xícara de azeite extravirgem","Folhas de manjericão fresco","Sal e pimenta-do-reino"],
        utensils:["Assadeira ou frigideira grelhada","Tigela pequena","Faca de pão"],
        steps:[
            {title:"Tostar o pão", text:"Grelhe as fatias de pão no forno ou frigideira até ficarem crocantes por fora."},
            {title:"Perfumar com alho", text:"Esfregue um dente de alho descascado sobre a superfície quente de cada fatia de pão."},
            {title:"Preparo do tomate", text:"Misture o tomate picado com azeite, manjericão, sal e pimenta."},
            {title:"Montagem", text:"Coloque uma porção generosa do tomate sobre as fatias de pão e sirva imediatamente."}
        ]
    },
    {
        id:26, name:"Escondidinho de Carne Seca", cat:"Brasileira", serves:"6 porções",
        status:"disponivel",
        description:"Camadas de pure macio de mandioca recheadas com carne seca bem temperada e gratinadas com queijo coalho.",
        ingredients:["500g de carne seca dessalgada e desfiada","1kg de mandioca cozida","2 colheres de manteiga","1/2 xícara de leite","1 cebola fatiada","150g de queijo coalho ralado"],
        utensils:["Espremedor de batatas ou mandioca","Panela média","Refratário para forno"],
        steps:[
            {title:"Fazer o purê", text:"Esprema a mandioca quente e leve ao fogo com a manteiga e o leite até formar um purê cremoso."},
            {title:"Refogar a carne", text:"Refogue a cebola e junte a carne seca desfiada até ficar bem saborosa."},
            {title:"Montagem", text:"Em um refratário, faça uma camada de purê, a carne seca e cubra com o restante do purê."},
            {title:"Gratinar", text:"Polvilhe queijo coalho e leve ao forno até dourar a superfície."}
        ]
    },
    {
        id:27, name:"Polenta Mole com Ragu de Linguiça", cat:"Italiana", serves:"4 porções",
        status:"disponivel",
        description:"Polenta cremosa e quente servida com um encorpado molho ragu de linguiça artesanal e tomate.",
        ingredients:["1 xícara de fubá pré-cozido","4 xícaras de água ou caldo de legumes","400g de linguiça toscana sem pele","1 lata de tomate pelado","1/2 cebola picada","2 colheres de manteiga","Queijo parmesão"],
        utensils:["Panela funda para polenta","Batedor de arame (fouet)","Frigideira para o ragu"],
        steps:[
            {title:"Preparo do ragu", text:"Desfaça a linguiça na frigideira, doure bem, adicione a cebola e o tomate pelado. Deixe cozinhar em fogo baixo."},
            {title:"Cozinhar a polenta", text:"Ferva a água com sal e adicione o fubá em fio constante, mexendo sempre com o fouet para não empelotar."},
            {title:"Finalizar polenta", text:"Cozinhe até encorpar e misture a manteiga e o parmesão."},
            {title:"Servir", text:"Coloque a polenta quente no prato e cubra com o ragu de linguiça."}
        ]
    },
    {
        id:28, name:"Chilli com Carne", cat:"Mexicana", serves:"4 porções",
        status:"disponivel",
        description:"Prato forte e levemente apimentado feito com carne moída, feijão vermelho, tomate e especiarias mexicanas.",
        ingredients:["500g de carne moída","1 lata de feijão vermelho cozido","1 pimentão picado","1 cebola picada","1 colher de chilli em pó","1 colher de cominho","400g de molho de tomate"],
        utensils:["Panela grande","Colher de pau","Faca de chef"],
        steps:[
            {title:"Dourar a carne", text:"Refogue a carne moída na panela até perder a cor rosada."},
            {title:"Aromáticos e temperos", text:"Adicione a cebola, o pimentão, o chilli em pó e o cominho."},
            {title:"Incorporar feijão", text:"Adicione o molho de tomate e o feijão vermelho drenado."},
            {title:"Cozimento lento", text:"Cozinhe em fogo baixo por 20 minutos até encorpar. Sirva com sour cream ou nachos."}
        ]
    },
    {
        id:29, name:"Torta Holandesa", cat:"Holandesa", serves:"8 porções",
        status:"disponivel",
        description:"Sobremesa refinada com base de biscoitos, creme aveludado de leite condensado e cobertura ganache de chocolate.",
        ingredients:["1 pacote de biscoito maizena","1 pacote de biscoito calipso para as laterais","200g de manteiga","1 lata de leite condensado","1 lata de creme de leite","200g de chocolate meio amargo"],
        utensils:["Forma de aro removível","Processador de alimentos","Batedeira"],
        steps:[
            {title:"Base da torta", text:"Triture o biscoito maizena, misture com metade da manteiga e forre o fundo da forma. Organize os biscoitos calipso nas laterais."},
            {title:"Preparo do creme", text:"Bata o restante da manteiga com o leite condensado até ficar cremoso e incorpore metade do creme de leite."},
            {title:"Montagem", text:"Despeje o creme sobre a base e leve ao freezer por 2 horas."},
            {title:"Ganache", text:"Derreta o chocolate com o resto do creme de leite e cubra a torta antes de servir."}
        ]
    },
    {
        id:30, name:"Lamen de Porco (Chashu)", cat:"Japonesa", serves:"2 porções",
        status:"datadas",
        description:"Sopa de macarrão reconfortante em caldo encorpado de porco, servida com ovo fatiado, broto de bambu e cebolinha.",
        ingredients:["2 porções de macarrão para lamen","1L de caldo de porco temperado com missô","2 fatias de barriga de porco assada (chashu)","1 ovo cozido com gema mole","Cebolinha e alga nori"],
        utensils:["Panela profunda para o caldo","Panela para o macarrão","Tigelas fundas tipo Donburi"],
        steps:[
            {title:"Aquecer o caldo", text:"Deixe o caldo de porco ferver brandamente."},
            {title:"Cozinhar macarrão", text:"Cozinhe o macarrão de lamen rapidamente por 2 minutos e escorra bem."},
            {title:"Montar a tigela", text:"Coloque o macarrão no fundo da tigela e cubra com o caldo fumegante."},
            {title:"Garni", text:"Decore por cima com as fatias de porco, o ovo partido ao meio, a cebolinha e a alga nori."}
        ]
    },
    {
        id:31, name:"Hummus Tradicional", cat:"Árabe", serves:"4 porções",
        status:"disponivel",
        description:"Pasta aveludada de grão-de-bico com tahine, alho e suco de limão, regada com azeite e páprica.",
        ingredients:["1 lata de grão-de-bico cozido (sem pele)","3 colheres de pasta Tahine","Suco de 1 limão","1 dente de alho","Azeite de oliva, sal e páprica para decorar"],
        utensils:["Processador de alimentos ou liquidificador","Spatula de silicone","Prato raso"],
        steps:[
            {title:"Processar", text:"Bata o grão-de-bico, o alho, o tahine e o suco de limão no processador."},
            {title:"Ajustar consistência", text:"Adicione pedras de gelo ou água gelada aos poucos enquanto bate para criar uma textura ultracremosa."},
            {title:"Servir", text:"Espalhe o hummus em um prato raso fazendo sulcos com a colher, regue com azeite e polvilhe páprica."}
        ]
    },
    {
        id:32, name:"Bobó de Camarão", cat:"Brasileira", serves:"4 porções",
        status:"disponivel",
        description:"Prato cremoso baiano feito com purê de mandioca, leite de coco, azeite de dendê e camarões salteados.",
        ingredients:["500g de camarão médio limpo","500g de mandioca cozida","200ml de leite de coco","2 colheres de azeite de dendê","1 pimentão amarelo picado","Coentro, cebola e alho"],
        utensils:["Liquidificador","Panela de barro ou funda","Frigideira"],
        steps:[
            {title:"Creme de mandioca", text:"Bata a mandioca cozida com o leite de coco no liquidificador até obter um creme liso."},
            {title:"Saltear camarões", text:"Doure os camarões rapidamente no azeite com sal e limão. Reserve."},
            {title:"Cozinhar o bobó", text:"Refogue a cebola, o alho e o pimentão no azeite de dendê. Adicione o creme de mandioca e deixe ferver."},
            {title:"Finalizar", text:"Junte os camarões, acerte o sal e misture o coentro fresco picado."}
        ]
    },
    {
        id:33, name:"Crème Brûlée", cat:"Francesa", serves:"4 porções",
        status:"disponivel",
        description:"Sobremesa francesa clássica constituída por um creme de baunilha rico coberto por uma crosta crocante de açúcar queimado.",
        ingredients:["500ml de creme de leite fresco","5 gemas","1/2 xícara de açúcar","1 colher de extrato de baunilha","Açúcar refinado para polvilhar"],
        utensils:["Maçarico culinário","Ramekins individuais","Assadeira para banho-maria","Batedor manual"],
        steps:[
            {title:"Misturar ingredientes", text:"Bata suavemente as gemas com o açúcar até dissolver. Aqueça o creme de leite com a baunilha e despeje sobre as gemas mexendo sempre."},
            {title:"Assar em banho-maria", text:"Distribua nos ramekins e asse em banho-maria a 160°C por cerca de 40 minutos."},
            {title:"Gelar", text:"Deixe esfriar e leve à geladeira por no mínimo 6 horas."},
            {title:"Caramelizar", text:"Na hora de servir, polvilhe uma camada fina de açúcar sobre o creme e queime com o maçarico."}
        ]
    },
    {
        id:34, name:"Ceviche de Caju", cat:"Vegana", serves:"2 porções",
        status:"disponivel",
        description:"Opção tropical e refrescante utilizando a fibra suculenta do caju marinado em temperos cítricos e pimenta.",
        ingredients:["4 cajus frescos e firmes","Suco de 2 limões","1/2 cebola roxa picada em tiras","1/2 pimenta dedo-de-moça sem sementes","Coentro fresco","Sal e azeite"],
        utensils:["Pano limpo para espremer o caju","Tigela de vidro","Faca afiada"],
        steps:[
            {title:"Preparo do caju", text:"Retire a castanha do caju, corte o pedúnculo em cubos e esprema suavemente em um pano para tirar o excesso de suco."},
            {title:"Marinar", text:"Misture o caju com o suco de limão, a cebola roxa e a pimenta."},
            {title:"Temperar e servir", text:"Ajuste o sal, regue com azeite e incorpore o coentro picado antes de servir gelado."}
        ]
    },
    {
        id:35, name:"Spaghetti alla Carbonara", cat:"Italiana", serves:"2 porções",
        status:"disponivel",
        description:"Receita autêntica romana feita com guanciale crocante, gemas de ovo, queijo pecorino e pimenta-do-reino sem creme de leite.",
        ingredients:["200g de spaghetti","150g de guanciale ou pancetta em cubos","3 gemas e 1 ovo inteiro","50g de queijo pecorino romano ralado","Pimenta-do-reino moída na hora"],
        utensils:["Frigideira grande","Tigela para os ovos","Panela funda para a massa","Pinça culinária"],
        steps:[
            {title:"Fritar o guanciale", text:"Frite o guanciale na frigideira até ficar crocante e soltar a gordura. Desligue o fogo."},
            {title:"Mistura de ovos", text:"Na tigela, misture as gemas, o ovo inteiro, o queijo pecorino e bastante pimenta-do-reino."},
            {title:"Cozinhar a massa", text:"Cozinhe o spaghetti em água salgada até ficar al dente."},
            {title:"Emulsionar fora do fogo", text:"Junte a massa à frigideira fora do fogo, adicione o creme de ovos e um pouco da água do cozimento, mexendo rápido para criar um molho cremoso sem empelotar os ovos."}
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
<div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-datadas'}">
                    ${r.status === 'disponivel' ? 'Disponível' : 'datadas'}
</div>
</div>
<div class="rc-category">${r.cat}</div>
        `;
        card.addEventListener('click', () => {
            activeId = r.id;
            renderList();
            renderDetail();

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

    const utensils = r.utensils || [];

    detailCol.innerHTML = `
<div class="detail-main-header">
<div>
<div class="rc-category">${r.cat}</div>
<h2 class="detail-main-title">${r.name}</h2>
</div>
<div class="status-badge ${r.status === 'disponivel' ? 'status-disponivel' : 'status-datadas'}" style="font-size:11px; padding:6px 14px;">
                ${r.status === 'disponivel' ? 'Disponível' : 'Datadas'}
</div>
</div>
 
        <div class="meta-info-grid">
</div>
 
        <div class="recipe-intro">${r.description}</div>
 
        <div class="ingredientes-utensilios-grid">
<div class="coluna-bloco">
<div class="block-title">Ingredientes Necessários</div>
<ul class="ingredients-layout">
                    ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
</ul>
</div>
<div class="coluna-bloco">
<div class="block-title">Utensílios Utilizados</div>
<ul class="ingredients-layout">
                    ${utensils.length ? utensils.map(u => `<li>${u}</li>`).join('') : '<li>Nenhum utensílio cadastrado.</li>'}
</ul>
</div>
</div>
 
        <div class="block-title">Modo de Preparo Passo a Passo</div>
<ol class="steps-layout">
            ${r.steps.map(s => `
<li class="step-card">
<div class="step-circle"></div>
<div class="step-content">
<h4>${s.title}</h4>
<p>${s.text}</p>
</div>
</li>
            `).join('')}
</ol>
    `;
}

// Responsividade — Toggle da Sidebar
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeSidebar();
    });
})();

// Inicialização segura das views
renderList();
renderDetail();

// ===== NOTIFICAÇÕES (Receitas) — estrutura pronta, sem regras de conteúdo ainda =====
(function () {
    const btn   = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    const list  = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    const clear = document.getElementById('notif-clear');
    if (!btn || !panel) return;

    const STORAGE_KEY = 'sigec-notif-lidas-receitas';

    // TODO: quando definir a regra, popule este array com objetos:
    // { id, tipo: 'err' | 'warn' | 'info', titulo, texto }
    function gerarNotificacoes() {
        const notifs = [];

        const lidas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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

    // Permite acionar de fora (ex: depois de adicionar alguma regra dinamicamente)
    window.atualizarNotificacoesReceitas = render;

    function marcarTodasLidas() {
        const ids = gerarNotificacoes().map(n => n.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
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