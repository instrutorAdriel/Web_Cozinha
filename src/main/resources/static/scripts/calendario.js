document.addEventListener("DOMContentLoaded", () => {
    // Inicializa na data atual do sistema para carregar o mês real de forma dinâmica
    let dataCalendario = new Date();
    let diaSelecionadoGlobal = new Date().getDate();
    let turmaAtivaId = null; // Guardará o ID da turma selecionada na Top Bar
    let alocacoesPorData = {};

    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Elementos do DOM do HTML
    const grid = document.getElementById("cal-grid");
    const indicadorMes = document.getElementById("cal-month");
    const labelDataPainel = document.getElementById("cal-panel-date");
    const containerAlocadas = document.getElementById("cal-allocated");
    const containerDisponiveis = document.getElementById("cal-available");
    const btnPrev = document.getElementById("cal-prev");
    const btnNext = document.getElementById("cal-next");
    const selectTurma = document.getElementById('selectTurma');

    /**
     * Função para carregar as turmas no select da Top Bar
     */
    function inicializarSelectTurmas() {
        if (!selectTurma) return;

        fetch('/calendario/turmas')
            .then(response => {
                if (!response.ok) throw new Error("Erro ao buscar turmas do instrutor");
                return response.json();
            })
            .then(turmas => {
                selectTurma.innerHTML = ''; // Limpa o texto de "A carregar..."

                if (turmas.length === 0) {
                    selectTurma.innerHTML = '<option value="">Nenhuma turma associada</option>';
                    return;
                }

                // Popula o select com as turmas vindas do banco
                turmas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma.id;
                    // AJUSTADO: Agora usa corretamente o atributo 'nomeTurma' vindo do Java
                    option.textContent = `${turma.nomeTurma} (${turma.laboratorio || 'Geral'})`;
                    selectTurma.appendChild(option);
                });

                // Define a primeira turma como ativa por padrão
                turmaAtivaId = selectTurma.value;

                // Renderiza o grid pela primeira vez (já vai trazer as fichas filtradas)
                renderizarGrid();
            })
            .catch(err => {
                console.error("Erro na inicialização:", err);
                // Se falhar, renderiza o grid mesmo assim para não quebrar a tela
                renderizarGrid();
            });
    }

    /**
     * Escuta quando o utilizador troca a turma no select da Top Bar
     */
    if (selectTurma) {
        selectTurma.addEventListener('change', (event) => {
            turmaAtivaId = event.target.value;

            // Recarrega o dia atual do calendário para trazer os dados da nova turma
            const celulaAtiva = document.querySelector('.day-cell.active-selected');
            if (celulaAtiva) {
                celulaAtiva.click(); // Força o clique no dia selecionado para recarregar as fichas
            }
        });
    }

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

                // Com o mapa updated, desenha o calendário
                renderizarGrid();
            })
            .catch(erro => {
                console.error("Erro ao processar contagem de fichas alocadas: ", erro);
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

        if (diaSelecionadoGlobal > totalDiasNoMes) {
            diaSelecionadoGlobal = totalDiasNoMes;
        }

        // 1. Cria os espaços vazios
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        // 2. Cria os blocos numéricos dos dias reais
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");
            celula.className = "day-cell";

            const spanNumero = document.createElement("span");
            spanNumero.textContent = dia;
            celula.appendChild(spanNumero);

            const diaSemana = new Date(ano, mes, dia).getDay();
            if (diaSemana === 0 || diaSemana === 6) {
                celula.classList.add("weekend");
            }

            const strMes = String(mes + 1).padStart(2, '0');
            const strDia = String(dia).padStart(2, '0');
            const dataIso = `${ano}-${strMes}-${strDia}`;
            celula.setAttribute("data-date", dataIso);

            if (alocacoesPorData[dataIso]) {
                const quantidadeFichas = alocacoesPorData[dataIso];
                const containerBolinhas = document.createElement("div");
                containerBolinhas.className = "indicator-dots";
                containerBolinhas.style.justifyContent = "flex-end";
                containerBolinhas.style.marginLeft = "auto";
                containerBolinhas.style.marginTop = "auto";

                for (let k = 0; k < quantidadeFichas; k++) {
                    const bolinha = document.createElement("div");
                    bolinha.className = "dot orange";
                    containerBolinhas.appendChild(bolinha);
                }
                celula.appendChild(containerBolinhas);
            }

            if (dia === diaSelecionadoGlobal) {
                celula.classList.add("active-selected");
                buscarFichasViaHibernate(dataIso, dia, nomesMeses[mes], ano);
            }

            celula.addEventListener("click", () => {
                document.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                diaSelecionadoGlobal = dia;
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

        containerAlocadas.innerHTML = '<p class="crumb-muted">A carregar agenda...</p>';
        containerDisponiveis.innerHTML = '<p class="crumb-muted">A carregar acervo...</p>';

        // BLINDAGEM: Se não houver ID de turma selecionado ou se for a string "undefined"
        if (!turmaAtivaId || turmaAtivaId === "undefined") {
            containerAlocadas.innerHTML = '<p class="crumb-muted">Selecione uma turma para ver a agenda.</p>';
            containerDisponiveis.innerHTML = '<p class="crumb-muted">Selecione uma turma para ver o acervo.</p>';
            return;
        }

        fetch(`/calendario/fichas?data=${dataIso}&idTurma=${turmaAtivaId}`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na resposta do servidor");
                return response.json();
            })
            .then(dados => {
                containerAlocadas.innerHTML = "";
                containerDisponiveis.innerHTML = "";

                if (!dados.alocadas || dados.alocadas.length === 0) {
                    containerAlocadas.innerHTML = '<p class="crumb-muted">Nenhuma aula ou ficha programada para este dia.</p>';
                } else {
                    dados.alocadas.forEach(ficha => {
                        containerAlocadas.appendChild(criarCardFicha(ficha.id, ficha.nome, 'success', "delete"));
                    });
                }

                if (!dados.Disponiveis || dados.Disponiveis.length === 0) {
                    containerDisponiveis.innerHTML = '<p class="crumb-muted">Acervo vazio.</p>';
                } else {
                    dados.Disponiveis.forEach(ficha => {
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

    /**
     * Cria a estrutura do card HTML para cada Ficha
     */
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

        // BLINDAGEM EXTRA: Se o ID da própria Ficha vier nulo ou indefinido por erro de mapeamento do banco
        if (!id || id === "undefined") {
            card.querySelector('.btn-fiche-action').disabled = true;
            card.querySelector('.btn-fiche-action').style.opacity = "0.5";
            return card;
        }

        // AÇÃO 1: Adicionar (+)
        if (acao === 'append') {
            card.querySelector('.btn-fiche-action').addEventListener('click', () => {
                const celulaAtiva = document.querySelector('.day-cell.active-selected');
                if (!celulaAtiva) return;

                if (!turmaAtivaId || turmaAtivaId === "undefined") {
                    alert("Selecione uma turma válida antes de alocar.");
                    return;
                }

                const dataIso = celulaAtiva.getAttribute('data-date');

                fetch(`/calendario/alocar?id=${id}&data=${dataIso}&idTurma=${turmaAtivaId}`, {method: 'GET'})
                    .then(response => {
                        if (!response.ok) throw new Error("Erro ao alocar");
                        carregarAlocacoesERenderizarGrid();
                        celulaAtiva.click();
                    })
                    .catch(err => console.error("Erro na alocação:", err));
            });
        }

        // AÇÃO 2: Remover (X)
        if (acao === 'delete') {
            card.querySelector('.btn-fiche-action').addEventListener('click', () => {
                const celulaAtiva = document.querySelector('.day-cell.active-selected');

                if (!turmaAtivaId || turmaAtivaId === "undefined") {
                    alert("Selecione uma turma válida antes de desalocar.");
                    return;
                }

                // AJUSTADO: Passa a idTurma na query string
                fetch(`/calendario/desalocar?id=${id}&idTurma=${turmaAtivaId}`, {method: 'GET'})
                    .then(response => {
                        if (!response.ok) throw new Error("Erro ao desalocar");
                        return response.text();
                    })
                    .then(mensagem => {
                        if (celulaAtiva) celulaAtiva.click();
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

    // GATILHO INICIAL
    inicializarSelectTurmas();
    carregarAlocacoesERenderizarGrid();
});