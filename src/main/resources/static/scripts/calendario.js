document.addEventListener("DOMContentLoaded", () => {
    // Inicializa na data atual do sistema para carregar o mês real de forma dinâmica
    let dataCalendario = new Date();
    let diaSelecionadoGlobal = new Date().getDate();

    // Dicionário/Mapa para armazenar o número de fichas alocadas por data (ex: {'2026-07-16': 2})
    let alocacoesPorData = {};

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Elementos do DOM do HTML
    const grid = document.getElementById("cal-grid");
    const indicadorMes = document.getElementById("cal-month");
    const labelDataPainel = document.getElementById("cal-panel-date");
    const containerAlocadas = document.getElementById("cal-allocated");
    const containerDisponiveis = document.getElementById("cal-available");
    const btnPrev = document.getElementById("cal-prev");
    const btnNext = document.getElementById("cal-next");

    /**
     * Busca assincronamente todas as fichas alocadas no banco de dados,
     * constrói o mapa de contagem por dia e chama a renderização do grid.
     */
    function carregarAlocacoesERenderizarGrid() {
        fetch("/calendario/fichas-alocadas")
            .then(response => {
                if (!response.ok) throw new Error("Erro ao buscar fichas alocadas");
                return response.json();
            })
            .then(fichas => {
                // Reinicia o mapeamento para limpar alocações antigas
                alocacoesPorData = {};

                // Agrupa e conta a quantidade de fichas associadas a cada data
                fichas.forEach(ficha => {
                    if (ficha.data) {
                        alocacoesPorData[ficha.data] = (alocacoesPorData[ficha.data] || 0) + 1;
                    }
                });

                // Com o mapa atualizado, desenha o calendário
                renderizarGrid();
            })
            .catch(erro => {
                console.error("Erro ao processar contagem de fichas alocadas: ", erro);
                // Mesmo em caso de erro, renderiza o grid vazio de notificações para não quebrar a tela
                renderizarGrid();
            });
    }

    /**
     * Renderiza o grid de dias do calendário
     */
    function renderizarGrid() {
        if (!grid) return;
        grid.innerHTML = "";

        const ano = dataCalendario.getFullYear();
        const mes = dataCalendario.getMonth();

        // Atualiza o texto do mês principal (Ex: "Julho 2026")
        if (indicadorMes) indicadorMes.textContent = `${nomesMeses[mes]} ${ano}`;

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

        // Validação de segurança: se mudarmos para um mês com menos dias (ex: de 31 para 30),
        // ajusta o dia selecionado para o último dia válido do novo mês.
        if (diaSelecionadoGlobal > totalDiasNoMes) {
            diaSelecionadoGlobal = totalDiasNoMes;
        }

        // 1. Cria os espaços vazios (alinhamento dos dias da semana)
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        // 2. Cria os blocos numéricos dos dias reais do mês
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");
            celula.className = "day-cell";

            const spanNumero = document.createElement("span");
            spanNumero.textContent = dia;
            celula.appendChild(spanNumero);

            // Marca fins de semana de forma automática
            const diaSemana = new Date(ano, mes, dia).getDay();
            if (diaSemana === 0 || diaSemana === 6) {
                celula.classList.add("weekend");
            }

            // Formata a data atual da célula em string ISO (YYYY-MM-DD) para enviar ao Java
            const strMes = String(mes + 1).padStart(2, '0');
            const strDia = String(dia).padStart(2, '0');
            const dataIso = `${ano}-${strMes}-${strDia}`;
            celula.setAttribute("data-date", dataIso);

            // Adiciona as bolinhas de notificação laranjas se houver fichas alocadas no dia
            if (alocacoesPorData[dataIso]) {
                const quantidadeFichas = alocacoesPorData[dataIso];

                // Container para organizar as bolinhas no rodapé da célula
                const containerBolinhas = document.createElement("div");
                containerBolinhas.className = "indicator-dots";
                
                // Estilização inline para posicionamento no canto inferior direito
                containerBolinhas.style.justifyContent = "flex-end";
                containerBolinhas.style.marginLeft = "auto";
                containerBolinhas.style.marginTop = "auto";

                // Loop que desenha o número de bolinhas correspondente ao total de fichas alocadas
                for (let k = 0; k < quantidadeFichas; k++) {
                    const bolinha = document.createElement("div");
                    bolinha.className = "dot orange";
                    containerBolinhas.appendChild(bolinha);
                }

                celula.appendChild(containerBolinhas);
            }

            // Seleção automática do dia ativo (funciona na primeira carga e na troca de meses)
            if (dia === diaSelecionadoGlobal) {
                celula.classList.add("active-selected");
                buscarFichasViaHibernate(dataIso, dia, nomesMeses[mes], ano);
            }

            // Evento ao clicar em qualquer dia
            celula.addEventListener("click", () => {
                document.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                diaSelecionadoGlobal = dia;

                // Chama o backend Java passando a data selecionada
                buscarFichasViaHibernate(dataIso, dia, nomesMeses[mes], ano);
            });

            grid.appendChild(celula);
        }
    }

    /**
     * Comunica-se assincronamente com o FichasController (Java)
     */
    function buscarFichasViaHibernate(dataIso, dia, nomeMes, ano) {
        if (labelDataPainel) labelDataPainel.textContent = `${dia} De ${nomeMes}, ${ano}`;

        // Feedback visual rápido enquanto o Java responde
        containerAlocadas.innerHTML = '<p class="crumb-muted">A carregar agenda...</p>';
        containerDisponiveis.innerHTML = '<p class="crumb-muted">A carregar acervo...</p>';

        // Faz o pedido AJAX ao endpoint do teu FichasController
        fetch(`/calendario/fichas?data=${dataIso}`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na resposta do servidor");
                return response.json();
            })
            .then(dados => {
                containerAlocadas.innerHTML = "";
                containerDisponiveis.innerHTML = "";

                // 1. Popula as Fichas Alocadas vindas do banco
                if (!dados.alocadas || dados.alocadas.length === 0) {
                    containerAlocadas.innerHTML = '<p class="crumb-muted">Nenhuma aula ou ficha programada para este dia.</p>';
                } else {
                    dados.alocadas.forEach(ficha => {
                        // AJUSTADO: Agora passa ficha.id como primeiro parâmetro
                        containerAlocadas.appendChild(criarCardFicha(ficha.id, ficha.nome, 'success', "delete"));
                    });
                }

                // 2. Popula as Fichas Disponíveis
                if (!dados.Disponiveis || dados.Disponiveis.length === 0) {
                    containerDisponiveis.innerHTML = '<p class="crumb-muted">Acervo vazio.</p>';
                } else {
                    dados.Disponiveis.forEach(ficha => {
                        // AJUSTADO: Agora passa ficha.id como primeiro parâmetro
                        containerDisponiveis.appendChild(criarCardFicha(ficha.id, ficha.nome, 'warning', "append"));
                    });
                }
            })
            .catch(erro => {
                console.error("Erro ao processar requisição: ", erro);
                containerAlocadas.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
                containerDisponiveis.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
            });
    }


    function criarCardFicha(id, nome, status, acao) {
        const card = document.createElement("div");
        card.className = "fiche-card";

        const icone = status === "success" ? "check_circle" : "warning";
        const textoEstoque = status === "success" ? "Estoque Completo" : "Verificar Insumos";

        card.innerHTML = `
        <div class="fiche-info">
            <p class="fiche-name">${nome}</p>
            <span class="stock-status ${status}">
                <span class="material-symbols-outlined">${icone}</span>${textoEstoque}
            </span>
        </div>
        <button class="btn-fiche-action ${acao}">
            <span class="material-symbols-outlined">${acao === 'delete' ? 'close' : 'add'}</span>
        </button>
    `;

        // ==========================================
        // AÇÃO 1: Configura o botão de Adicionar (+)
        // ==========================================
        if (acao === 'append') {
            card.querySelector('.btn-fiche-action').addEventListener('click', () => {
                const celulaAtiva = document.querySelector('.day-cell.active-selected');
                if (!celulaAtiva) return;

                const dataIso = celulaAtiva.getAttribute('data-date');

                fetch(`/calendario/alocar?id=${id}&data=${dataIso}`, { method: 'GET' })
                    .then(response => {
                        if (!response.ok) throw new Error("Erro ao alocar");
                        // Recarrega as alocações e atualiza o calendário com as bolinhas correspondentes
                        carregarAlocacoesERenderizarGrid();
                    })
                    .catch(err => console.error("Erro na alocação:", err));
            });
        }

        // ==========================================
        // AÇÃO 2: Configura o botão de Remover (X)
        // ==========================================
        if (acao === 'delete') {
            card.querySelector('.btn-fiche-action').addEventListener('click', () => {
                const celulaAtiva = document.querySelector('.day-cell.active-selected');

                // Dispara a requisição para remover a data da ficha
                fetch(`/calendario/desalocar?id=${id}`, { method: 'GET' })
                    .then(response => {
                        if (!response.ok) throw new Error("Erro ao desalocar");
                        return response.text();
                    })
                    .then(mensagem => {
                        alert(mensagem); // Alerta opcional de sucesso
                        // Recarrega as alocações e atualiza o calendário com as bolinhas correspondentes
                        carregarAlocacoesERenderizarGrid();
                    })
                    .catch(err => {
                        console.error("Erro na desalocação:", err);
                        alert("Não foi possível remover a ficha.");
                    });
            });
        }

        return card;
    }

    // Ouvintes de cliques nos botões de navegação dos meses
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() - 1);
            carregarAlocacoesERenderizarGrid();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() + 1);
            carregarAlocacoesERenderizarGrid();
        });
    }

    // Inicialização da primeira renderização automática buscando os dados alocados do banco
    carregarAlocacoesERenderizarGrid();
});