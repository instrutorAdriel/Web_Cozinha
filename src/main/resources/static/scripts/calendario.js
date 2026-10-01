const CalendarioSIGEC = {
    // 1. Controle de Estado Reativo
    state: {
        dataAtual: new Date(),
        diaSelecionado: new Date().getDate(),
        alocacoesPorData: {},
        fichaIdDesalocar: null
    },

    // 2. Mapeamento dos Elementos DOM
    elements: {
        selectTurma: document.getElementById("turma-select"),
        grid: document.getElementById("cal-grid"),
        indicadorMes: document.getElementById("cal-month"),
        labelDataPainel: document.getElementById("cal-panel-date"),
        containerAlocadas: document.getElementById("cal-allocated"),
        containerDisponiveis: document.getElementById("cal-available"),
        btnPrev: document.getElementById("cal-prev"),
        btnNext: document.getElementById("cal-next"),
        dialogConfirmacao: document.getElementById("modal-confirmacao"),
        btnConfirmarExclusao: document.getElementById("btn-confirmar-exclusao"),
        btnCancelarExclusao: document.getElementById("btn-cancelar-exclusao")
    },

    nomesMeses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],

    // 3. Inicialização e Eventos Fixos
    init() {
        this.bindEvents();
        this.carregarTurmas();
    },

    getTurmaId() {
        return this.elements.selectTurma ? this.elements.selectTurma.value : null;
    },

    bindEvents() {
        const { selectTurma, btnPrev, btnNext, btnCancelarExclusao, btnConfirmarExclusao } = this.elements;

        if (selectTurma) {
            selectTurma.addEventListener("change", () => this.carregarAlocacoes());
        }

        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                this.state.dataAtual.setMonth(this.state.dataAtual.getMonth() - 1);
                this.carregarAlocacoes();
            });
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                this.state.dataAtual.setMonth(this.state.dataAtual.getMonth() + 1);
                this.carregarAlocacoes();
            });
        }

        if (btnCancelarExclusao) {
            btnCancelarExclusao.addEventListener("click", () => {
                if (this.elements.dialogConfirmacao) this.elements.dialogConfirmacao.close();
                this.state.fichaIdDesalocar = null;
            });
        }

        if (btnConfirmarExclusao) {
            btnConfirmarExclusao.addEventListener("click", () => this.confirmarDesalocacao());
        }
    },

    // ==========================================
    // CHAMADAS DE API (ASYNC / AWAIT)
    // ==========================================

    async carregarTurmas() {
        if (!this.elements.selectTurma) {
            this.carregarAlocacoes();
            return;
        }

        try {
            const response = await fetch("/turmas/usuario");
            if (!response.ok) throw new Error("Erro ao carregar turmas");

            const turmas = await response.json();
            const select = this.elements.selectTurma;
            select.innerHTML = "";

            if (turmas.length === 0) {
                select.innerHTML = '<option value="">Nenhuma turma vinculada</option>';
            } else {
                turmas.forEach(turma => {
                    const id = turma.idTurma || turma.id;
                    const nome = turma.nome || turma.nomeTurma;
                    select.appendChild(new Option(nome, id));
                });
            }
        } catch (erro) {
            console.error("Erro no carregamento das turmas:", erro);
            this.elements.selectTurma.innerHTML = '<option value="">Erro ao carregar turmas</option>';
        } finally {
            // Sincronização garantida: desenha a grid independente do resultado da API
            this.carregarAlocacoes();
        }
    },

    async carregarAlocacoes() {
        const idTurma = this.getTurmaId();
        const url = idTurma ? `/calendario/fichas-alocadas?idTurma=${idTurma}` : "/calendario/fichas-alocadas";

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao carregar marcadores alocados.");

            const fichas = await response.json();
            this.state.alocacoesPorData = {};

            fichas.forEach(ficha => {
                if (ficha.data) {
                    this.state.alocacoesPorData[ficha.data] = (this.state.alocacoesPorData[ficha.data] || 0) + 1;
                }
            });
        } catch (erro) {
            console.error("Erro ao carregar alocações:", erro);
        } finally {
            this.renderizarGrid();
        }
    },

    async buscarFichasDoDia(dataIso, dia, nomeMes, ano) {
        const { labelDataPainel, containerAlocadas, containerDisponiveis } = this.elements;

        if (labelDataPainel) labelDataPainel.textContent = `${dia} De ${nomeMes}, ${ano}`;
        if (containerAlocadas) containerAlocadas.innerHTML = '<p class="crumb-muted">A carregar agenda...</p>';
        if (containerDisponiveis) containerDisponiveis.innerHTML = '<p class="crumb-muted">A carregar acervo...</p>';

        const idTurma = this.getTurmaId();
        const url = idTurma ? `/calendario/fichas?data=${dataIso}&idTurma=${idTurma}` : `/calendario/fichas?data=${dataIso}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro na resposta do servidor.");

            const dados = await response.json();

            if (containerAlocadas) containerAlocadas.innerHTML = "";
            if (containerDisponiveis) containerDisponiveis.innerHTML = "";

            const alocadas = dados.alocadas || [];
            const disponiveis = dados.disponiveis || dados.Disponiveis || [];

            if (alocadas.length === 0 && containerAlocadas) {
                containerAlocadas.innerHTML = '<p class="crumb-muted">Nenhuma aula ou ficha programada para este dia.</p>';
            } else {
                alocadas.forEach(ficha => containerAlocadas.appendChild(this.criarCardFicha(ficha, "success", "delete")));
            }

            if (disponiveis.length === 0 && containerDisponiveis) {
                containerDisponiveis.innerHTML = '<p class="crumb-muted">Acervo vazio.</p>';
            } else {
                disponiveis.forEach(ficha => containerDisponiveis.appendChild(this.criarCardFicha(ficha, "warning", "append")));
            }
        } catch (erro) {
            console.error("Erro ao carregar fichas:", erro);
            if (containerAlocadas) containerAlocadas.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
            if (containerDisponiveis) containerDisponiveis.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
        }
    },

    async alocarFicha(id, dataIso) {
        const idTurma = this.getTurmaId();

        // Monta os parâmetros que serão enviados no corpo do POST
        const bodyData = new URLSearchParams();
        bodyData.append("id", id);
        bodyData.append("data", dataIso);
        if (idTurma) {
            bodyData.append("idTurma", idTurma);
        }

        try {
            const response = await fetch("/calendario/alocar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyData.toString()
            });

            if (!response.ok) throw new Error("Erro ao alocar ficha.");

            // Recarrega as alocações para desenhar a bolinha na grid e atualizar o painel
            this.carregarAlocacoes();
        } catch (erro) {
            console.error("Erro na alocação:", erro);
            alert("Não foi possível agendar a ficha para esta data.");
        }
    },

    solicitarDesalocacao(id) {
        this.state.fichaIdDesalocar = id;
        if (this.elements.dialogConfirmacao) {
            this.elements.dialogConfirmacao.showModal();
        } else {
            this.confirmarDesalocacao();
        }
    },

    async confirmarDesalocacao() {
        if (!this.state.fichaIdDesalocar) return;

        const idTurma = this.getTurmaId();
        const url = `/calendario/desalocar?id=${this.state.fichaIdDesalocar}${idTurma ? `&idTurma=${idTurma}` : ''}`;

        try {
            const response = await fetch(url, { method: "POST" });
            if (!response.ok) throw new Error("Erro ao desalocar ficha.");

            if (this.elements.dialogConfirmacao) this.elements.dialogConfirmacao.close();
            this.state.fichaIdDesalocar = null;
            this.carregarAlocacoes();
        } catch (erro) {
            console.error("Erro ao remover ficha:", erro);
            alert("Ocorreu um erro ao tentar retirar a ficha do calendário.");
        }
    },

    // ==========================================
    // RENDERIZAÇÃO DO DOM E MONTAGEM DA GRID
    // ==========================================

    renderizarGrid() {
        const { grid, indicadorMes } = this.elements;
        if (!grid) return;

        grid.innerHTML = "";
        const { dataAtual, diaSelecionado } = this.state;
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        if (indicadorMes) indicadorMes.textContent = `${this.nomesMeses[mes]} ${ano}`;

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

        // Evita selecionar dia superior ao limite do mês (ex: dia 31 em fevereiro)
        if (this.state.diaSelecionado > totalDiasNoMes) {
            this.state.diaSelecionado = totalDiasNoMes;
        }

        // Espaços em branco antes do dia 1
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        // Constrói os dias do mês
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");
            celula.className = "day-cell";

            const spanNumero = document.createElement("span");
            spanNumero.textContent = dia;
            celula.appendChild(spanNumero);

            const diaSemana = new Date(ano, mes, dia).getDay();
            if (diaSemana === 0 || diaSemana === 6) celula.classList.add("weekend");

            const strMes = String(mes + 1).padStart(2, "0");
            const strDia = String(dia).padStart(2, "0");
            const dataIso = `${ano}-${strMes}-${strDia}`;
            celula.setAttribute("data-date", dataIso);

            // Adiciona as bolinhas indicadoras
            const qtdFichas = this.state.alocacoesPorData[dataIso];
            if (qtdFichas) {
                const dotsContainer = document.createElement("div");
                dotsContainer.className = "indicator-dots";
                Object.assign(dotsContainer.style, { justifyContent: "flex-end", marginLeft: "auto", marginTop: "auto" });

                for (let k = 0; k < qtdFichas; k++) {
                    const dot = document.createElement("div");
                    dot.className = "dot orange";
                    dotsContainer.appendChild(dot);
                }
                celula.appendChild(dotsContainer);
            }

            // Seleção de dia ativo
            if (dia === this.state.diaSelecionado) {
                celula.classList.add("active-selected");
                this.buscarFichasDoDia(dataIso, dia, this.nomesMeses[mes], ano);
            }

            celula.addEventListener("click", () => {
                grid.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                this.state.diaSelecionado = dia;
                this.buscarFichasDoDia(dataIso, dia, this.nomesMeses[mes], ano);
            });

            grid.appendChild(celula);
        }
    },

    // Criação dos Cards com Material Symbols
    criarCardFicha(ficha, status, acao) {
        const id = ficha.id || ficha.idFicha;
        const nome = ficha.nomeFicha || ficha.titulo || ficha.nome || "Ficha sem título";
        const icone = status === "success" ? "check_circle" : "warning";
        const textoEstoque = status === "success" ? "Estoque Completo" : "Verificar Insumos";

        const card = document.createElement("div");
        card.className = "fiche-card";
        card.innerHTML = `
            <div class="fiche-info">
                <p class="fiche-name">${nome}</p>
                <span class="stock-status ${status}">
                    <span class="material-symbols-outlined">${icone}</span>
                    ${textoEstoque}
                </span>
            </div>
            <button class="btn-fiche-action ${acao}">
                <span class="material-symbols-outlined">${acao === "delete" ? "close" : "add"}</span>
            </button>
        `;

        const btnAcao = card.querySelector(".btn-fiche-action");

        if (acao === "append") {
            btnAcao.addEventListener("click", () => {
                const celulaAtiva = document.querySelector(".day-cell.active-selected");
                if (celulaAtiva) {
                    this.alocarFicha(id, celulaAtiva.getAttribute("data-date"));
                }
            });
        } else if (acao === "delete") {
            btnAcao.addEventListener("click", () => this.solicitarDesalocacao(id));
        }

        return card;
    }
};

// Disparo de Inicialização do Módulo
document.addEventListener("DOMContentLoaded", () => CalendarioSIGEC.init());