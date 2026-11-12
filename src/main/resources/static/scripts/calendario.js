const CalendarioSIGEC = {
    state: {
        dataAtual: new Date(),
        diaSelecionado: new Date().getDate(),
        dataIsoSelecionada: null,
        alocacoesPorData: {},
        agendamentosPorData: {}
    },

    elements: {
        selectTurma: document.getElementById("turma-select") || document.getElementById("select-turma"),
        grid: document.getElementById("cal-grid"),
        indicadorMes: document.getElementById("cal-month"),
        labelDataPainel: document.getElementById("cal-panel-date"),
        containerAlocadas: document.getElementById("cal-allocated"),
        containerDisponiveis: document.getElementById("cal-available"),
        btnPrev: document.getElementById("cal-prev"),
        btnNext: document.getElementById("cal-next")
    },

    nomesMeses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],

    init() {
        this.bindEvents();
        this.carregarTurmas();
    },

    getTurmaId() {
        if (this.elements.selectTurma && this.elements.selectTurma.value) {
            return this.elements.selectTurma.value;
        }
        return sessionStorage.getItem("turmaSelecionadaId") || "1";
    },

    bindEvents() {
        const { selectTurma, btnPrev, btnNext } = this.elements;

        if (selectTurma) {
            selectTurma.addEventListener("change", () => {
                if (selectTurma.value) sessionStorage.setItem("turmaSelecionadaId", selectTurma.value);
                this.carregarAlocacoes();
                this.recarregarPainelDiaAtual(false);
            });
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
    },

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
                select.innerHTML = '<option value="1">Turma 1</option>';
            } else {
                turmas.forEach(turma => {
                    const id = turma.idTurma || turma.id;
                    const nomeTurma = turma.nomeTurma || turma.nome || "Turma sem nome";
                    let labNome = '';
                    if (typeof turma.laboratorio === 'object' && turma.laboratorio !== null) {
                        labNome = turma.laboratorio.nomeLaboratorio || '';
                    } else if (typeof turma.laboratorio === 'string') {
                        labNome = turma.laboratorio;
                    }
                    const textoOpcao = labNome ? `${nomeTurma} (${labNome})` : nomeTurma;
                    select.appendChild(new Option(textoOpcao, id));
                });

                const turmaSalva = sessionStorage.getItem("turmaSelecionadaId");
                const existeTurma = turmas.some(t => (t.idTurma || t.id).toString() === turmaSalva);
                if (turmaSalva && existeTurma) select.value = turmaSalva;
            }
        } catch (erro) {
            console.error("Erro no carregamento das turmas:", erro);
            if (this.elements.selectTurma) this.elements.selectTurma.innerHTML = '<option value="1">Turma 1</option>';
        } finally {
            this.carregarAlocacoes();
        }
    },

    async carregarAlocacoes() {
        const idTurma = this.getTurmaId();
        const url = idTurma ? `/calendario/fichas-alocadas?idTurma=${idTurma}` : "/calendario/fichas-alocadas";

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao carregar marcadores alocados.");

            const agendamentos = await response.json();
            this.state.alocacoesPorData = {};
            this.state.agendamentosPorData = {};

            agendamentos.forEach(agendamento => {
                let dataIso = agendamento.data;
                if (Array.isArray(dataIso)) {
                    dataIso = `${dataIso[0]}-${String(dataIso[1]).padStart(2, '0')}-${String(dataIso[2]).padStart(2, '0')}`;
                } else if (typeof dataIso === 'string') {
                    dataIso = dataIso.split('T')[0];
                }

                if (dataIso) {
                    this.state.alocacoesPorData[dataIso] = (this.state.alocacoesPorData[dataIso] || 0) + 1;
                    if (!this.state.agendamentosPorData[dataIso]) this.state.agendamentosPorData[dataIso] = [];
                    const idAgendamento = agendamento.idAgendamento || agendamento.id;
                    if (idAgendamento) this.state.agendamentosPorData[dataIso].push(idAgendamento);
                }
            });
        } catch (erro) {
            console.error("Erro ao carregar alocações:", erro);
        } finally {
            this.renderizarGrid();
        }
    },

    // A mágica: silentUpdate = true por padrão nas transições de cards
    async buscarFichasDoDia(dataIso, dia, nomeMes, ano, silentUpdate = true) {
        this.state.dataIsoSelecionada = dataIso;
        const { labelDataPainel, containerAlocadas, containerDisponiveis } = this.elements;

        if (labelDataPainel) labelDataPainel.textContent = `${dia} De ${nomeMes}, ${ano}`;

        // Se NÃO for update silencioso, zera tudo com o spinner.
        if (!silentUpdate) {
            const htmlSpinner = '<div class="spinner-container"><div class="spinner-loader"></div></div>';
            if (containerAlocadas) containerAlocadas.innerHTML = htmlSpinner;
            if (containerDisponiveis) containerDisponiveis.innerHTML = htmlSpinner;
        }

        const idTurma = this.getTurmaId();
        const url = idTurma ? `/calendario/fichas?data=${dataIso}&idTurma=${idTurma}` : `/calendario/fichas?data=${dataIso}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro na resposta do servidor.");
            const dados = await response.json();

            // SÓ ESVAZIA A TELA AGORA QUE OS DADOS CHEGARAM
            if (containerAlocadas) containerAlocadas.innerHTML = "";
            if (containerDisponiveis) containerDisponiveis.innerHTML = "";

            const alocadas = dados.alocadas || [];
            const disponiveis = dados.disponiveis || dados.Disponiveis || [];

            // 1. Monta as datadas
            if (alocadas.length === 0 && containerAlocadas) {
                containerAlocadas.innerHTML = '<p class="crumb-muted msg-vazia">Nenhuma aula programada para este dia.</p>';
            } else if (containerAlocadas) {
                alocadas.forEach(agendamento => {
                    const fichaObj = agendamento.ficha || (agendamento.turmaFicha ? agendamento.turmaFicha.ficha : agendamento);
                    const idAgendamento = agendamento.idAgendamento || agendamento.id;
                    const idFicha = fichaObj ? (fichaObj.idFicha || fichaObj.id) : null;
                    const nome = fichaObj ? (fichaObj.nomeFicha || fichaObj.nome || fichaObj.titulo) : "Ficha sem título";

                    containerAlocadas.appendChild(this.criarCardFicha({
                        id: idAgendamento, idFicha: idFicha, nome: nome
                    }, "success", "delete"));
                });
            }

            // 2. Monta as do acervo
            if (disponiveis.length === 0 && containerDisponiveis) {
                containerDisponiveis.innerHTML = '<p class="crumb-muted msg-vazia">Acervo vazio ou todas já agendadas.</p>';
            } else if (containerDisponiveis) {
                disponiveis.forEach(item => {
                    const fichaObj = item.ficha ? item.ficha : item;
                    const idFicha = item.idFicha || item.id_ficha || item.id || (fichaObj ? fichaObj.id : null);
                    const nome = fichaObj ? (fichaObj.nomeFicha || fichaObj.nome || item.nomeFicha) : "Ficha sem título";

                    containerDisponiveis.appendChild(this.criarCardFicha({
                        id: idFicha, idFicha: idFicha, nome: nome
                    }, "warning", "append"));
                });
            }
        } catch (erro) {
            console.error("Erro ao carregar fichas:", erro);
        }
    },

    // =========================================================
    // TRANSIÇÕES EXATAS SEM PISCAR
    // =========================================================
    async alocarFicha(cardElement, idFicha, nomeFicha, dataIso) {
        if (!idFicha || !dataIso || !cardElement) return;

        // Trava para evitar duplo clique
        if (cardElement.hasAttribute("data-loading")) return;
        cardElement.setAttribute("data-loading", "true");
        cardElement.classList.add("is-loading");

        const idTurma = this.getTurmaId();
        const btnElement = cardElement.querySelector(".btn-fiche-action");
        let conteudoOriginal = null;

        if (btnElement) {
            btnElement.disabled = true;
            conteudoOriginal = btnElement.innerHTML;
            btnElement.classList.add("loading");
            btnElement.innerHTML = '<span class="spinner-btn"></span>';
        }

        const bodyData = new URLSearchParams();
        bodyData.append("idFicha", String(idFicha));
        bodyData.append("id", String(idFicha));
        bodyData.append("idTurma", String(idTurma));
        bodyData.append("data", String(dataIso));

        try {
            const response = await fetch("/calendario/alocar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: bodyData.toString()
            });

            if (!response.ok) throw new Error(await response.text() || "Erro ao alocar ficha.");

            // Recarrega as bolinhas e a lista lateral de forma "Silent"
            await Promise.all([
                this.carregarAlocacoes(),
                this.recarregarPainelDiaAtual(true)
            ]);

        } catch (erro) {
            console.error("Erro na alocação:", erro);
            alert(erro.message || "Não foi possível agendar a ficha.");

            cardElement.removeAttribute("data-loading");
            cardElement.classList.remove("is-loading");
            if (btnElement && conteudoOriginal) {
                btnElement.classList.remove("loading");
                btnElement.disabled = false;
                btnElement.innerHTML = conteudoOriginal;
            }
        }
    },

    async desalocarFicha(cardElement, idAgendamento, nomeFicha = null, idFicha = null) {
        if (!idAgendamento) return;

        if (cardElement) {
            if (cardElement.hasAttribute("data-loading")) return;
            cardElement.setAttribute("data-loading", "true");
            cardElement.classList.add("is-loading");
        }

        const btnElement = cardElement ? cardElement.querySelector(".btn-fiche-action") : null;
        let conteudoOriginal = null;

        if (btnElement) {
            btnElement.disabled = true;
            conteudoOriginal = btnElement.innerHTML;
            btnElement.classList.add("loading");
            btnElement.innerHTML = '<span class="spinner-btn"></span>';
        }

        const bodyData = new URLSearchParams();
        bodyData.append("id", String(idAgendamento));

        try {
            const response = await fetch("/calendario/desalocar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: bodyData.toString()
            });

            if (!response.ok) throw new Error("Erro ao desalocar ficha.");

            // Faz a troca inteira das divs silenciosamente.
            await Promise.all([
                this.carregarAlocacoes(),
                this.recarregarPainelDiaAtual(true)
            ]);

        } catch (erro) {
            console.error("Erro ao remover ficha:", erro);
            alert("Ocorreu um erro ao retirar a ficha do agendamento.");

            if (cardElement) {
                cardElement.removeAttribute("data-loading");
                cardElement.classList.remove("is-loading");
            }
            if (btnElement && conteudoOriginal) {
                btnElement.classList.remove("loading");
                btnElement.disabled = false;
                btnElement.innerHTML = conteudoOriginal;
            }
        }
    },

    recarregarPainelDiaAtual(silentUpdate = true) {
        const { dataAtual, diaSelecionado, dataIsoSelecionada } = this.state;
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        const dataIso = dataIsoSelecionada || `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`;
        return this.buscarFichasDoDia(dataIso, diaSelecionado, this.nomesMeses[mes], ano, silentUpdate);
    },

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

        if (this.state.diaSelecionado > totalDiasNoMes) this.state.diaSelecionado = totalDiasNoMes;

        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");
            celula.className = "day-cell";

            const spanNumero = document.createElement("span");
            spanNumero.textContent = dia;
            celula.appendChild(spanNumero);

            const diaSemana = new Date(ano, mes, dia).getDay();
            const strMes = String(mes + 1).padStart(2, "0");
            const strDia = String(dia).padStart(2, "0");
            const dataIso = `${ano}-${strMes}-${strDia}`;

            const feriados = [
                `${ano}-01-01`, `${ano}-04-21`, `${ano}-05-01`, `${ano}-09-07`,
                `${ano}-10-12`, `${ano}-11-02`, `${ano}-11-15`, `${ano}-11-20`, `${ano}-12-25`
            ];

            const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
            const ehFeriado = feriados.includes(dataIso);

            if (ehFimDeSemana || ehFeriado) {
                celula.classList.add(ehFeriado ? "holiday" : "weekend");
                celula.style.pointerEvents = "none";
                celula.style.opacity = "0.4";
            }

            celula.setAttribute("data-date", dataIso);

            const qtdFichas = this.state.alocacoesPorData[dataIso] || 0;
            if (qtdFichas > 0) {
                const dotsContainer = document.createElement("div");
                dotsContainer.className = "indicator-dots";
                Object.assign(dotsContainer.style, { display: "flex", gap: "3px", justifyContent: "flex-end", marginLeft: "auto", marginTop: "auto" });

                for (let k = 0; k < qtdFichas; k++) {
                    const dot = document.createElement("div");
                    dot.className = "dot orange";
                    dotsContainer.appendChild(dot);
                }
                celula.appendChild(dotsContainer);
            }

            if (dia === this.state.diaSelecionado) {
                celula.classList.add("active-selected");
                // Importante: quando clica na célula e muda de dia, não é silent. Assim ele apaga e mostra carregando.
                // Mas, durante a renderização inicial (montando a grid na tela), fazemos em background.
                this.buscarFichasDoDia(dataIso, dia, this.nomesMeses[mes], ano, true);
            }

            celula.addEventListener("click", () => {
                grid.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                this.state.diaSelecionado = dia;
                // Ao trocar de dia manualmente, queremos ver que está atualizando
                this.buscarFichasDoDia(dataIso, dia, this.nomesMeses[mes], ano, false);
            });

            grid.appendChild(celula);
        }
    },

    criarCardFicha(item, status, acao) {
        const id = item.id;
        const idFicha = item.idFicha || id;
        const nome = item.nome || "Ficha sem título";
        const icone = status === "success" ? "check_circle" : "warning";
        const textoEstoque = status === "success" ? "Estoque Completo" : "Verificar Insumos";

        const card = document.createElement("div");
        card.className = "fiche-card";
        card.setAttribute("data-id", id);
        card.setAttribute("data-id-ficha", idFicha);

        card.innerHTML = `
            <div class="fiche-info">
                <p class="fiche-name">${nome}</p>
                <span class="stock-status ${status}">
                    <span class="material-symbols-outlined">${icone}</span>
                    ${textoEstoque}
                </span>
            </div>
            <button class="btn-fiche-action ${acao}" title="${acao === "delete" ? "Remover do agendamento" : "Agendar para este dia"}">
                <span class="material-symbols-outlined">${acao === "delete" ? "close" : "add"}</span>
            </button>
        `;

        const btnAcao = card.querySelector(".btn-fiche-action");

        if (acao === "append") {
            btnAcao.addEventListener("click", (e) => {
                e.preventDefault();
                const celulaAtiva = document.querySelector(".day-cell.active-selected");
                if (celulaAtiva) {
                    this.alocarFicha(card, idFicha, nome, celulaAtiva.getAttribute("data-date"));
                }
            });
        } else if (acao === "delete") {
            btnAcao.addEventListener("click", (e) => {
                e.preventDefault();
                this.desalocarFicha(card, id, nome, idFicha);
            });
        }

        return card;
    }
};

document.addEventListener("DOMContentLoaded", () => CalendarioSIGEC.init());

// ===== CONFIRMAÇÃO DE SAÍDA =====
const btnSair = document.getElementById("btnSair");
const modalSair = document.getElementById("confirmacaoSaida");
const btnNao = document.getElementById("btnNao");
const btnSim = document.getElementById("btnSim");
const formLogout = document.getElementById("formLogout");

if (btnSair && modalSair) { btnSair.addEventListener("click", (e) => { e.preventDefault(); modalSair.classList.add("show"); }); }
if (btnNao && modalSair) { btnNao.addEventListener("click", () => modalSair.classList.remove("show")); }
if (btnSim && formLogout) { btnSim.addEventListener("click", () => formLogout.submit()); }
if (modalSair) { modalSair.addEventListener("click", (e) => { if (e.target === modalSair) modalSair.classList.remove("show"); }); }