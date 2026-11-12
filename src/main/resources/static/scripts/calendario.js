const CalendarioSIGEC = {
    state: {
        dataAtual: new Date(),
        diaSelecionado: new Date().getDate(),
        dataIsoSelecionada: null,
        alocacoesPorData: {},
        cacheAgendamentos: [],
        cacheDisponiveis: [],
        fichasAlocando: new Set(),
        agendamentosDesalocando: new Set(),
        abortControllerDia: null
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
                if (selectTurma.value) {
                    sessionStorage.setItem("turmaSelecionadaId", selectTurma.value);
                }
                this.state.fichasAlocando.clear();
                this.state.agendamentosDesalocando.clear();
                this.sincronizarTudoDaTurma(true);
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                this.state.dataAtual.setMonth(this.state.dataAtual.getMonth() - 1);
                this.renderizarGrid();
                this.selecionarDiaInstantaneo(this.state.diaSelecionado);
            });
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                this.state.dataAtual.setMonth(this.state.dataAtual.getMonth() + 1);
                this.carregarAlocacoesERenderizarMes();
            });
        }
    },

    carregarAlocacoesERenderizarMes() {
        this.renderizarGrid();
        this.selecionarDiaInstantaneo(this.state.diaSelecionado);
    },

    // =========================================================
    // NORMALIZAÇÃO SEGURA DE DADOS E DATAS
    // =========================================================
    normalizarDataIso(dataBruta) {
        if (!dataBruta) return null;
        if (Array.isArray(dataBruta)) {
            return `${dataBruta[0]}-${String(dataBruta[1]).padStart(2, "0")}-${String(dataBruta[2]).padStart(2, "0")}`;
        }
        if (typeof dataBruta === "string") {
            return dataBruta.split("T")[0].trim();
        }
        return null;
    },

    extrairAgendamento(ag) {
        const fichaObj = ag.ficha || (ag.turmaFicha ? ag.turmaFicha.ficha : ag);
        const idAgendamento = ag.idAgendamento || ag.id;
        const idFicha = fichaObj ? (fichaObj.idFicha || fichaObj.id) : idAgendamento;
        const nome = fichaObj ? (fichaObj.nomeFicha || fichaObj.nome || fichaObj.titulo) : "Ficha sem título";
        const dataIso = this.normalizarDataIso(ag.data || (ag.turmaFicha ? ag.turmaFicha.data : null));

        return { idAgendamento, idFicha, nome, dataIso };
    },

    extrairFichaDisponivel(item) {
        const fichaObj = item.ficha ? item.ficha : item;
        const idFicha = item.idFicha || item.id_ficha || item.id || (fichaObj ? fichaObj.id : null);
        const nome = fichaObj ? (fichaObj.nomeFicha || fichaObj.nome || item.nomeFicha) : "Ficha sem título";
        return { idFicha, nome };
    },

    // =========================================================
    // CARREGAMENTO DAS TURMAS E CACHE DA TURMA ATIVA
    // =========================================================
    async carregarTurmas() {
        if (!this.elements.selectTurma) {
            this.sincronizarTudoDaTurma(true);
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
                    let labNome = "";
                    if (typeof turma.laboratorio === "object" && turma.laboratorio !== null) {
                        labNome = turma.laboratorio.nomeLaboratorio || "";
                    } else if (typeof turma.laboratorio === "string") {
                        labNome = turma.laboratorio;
                    }
                    const textoOpcao = labNome ? `${nomeTurma} (${labNome})` : nomeTurma;
                    select.appendChild(new Option(textoOpcao, id));
                });

                const turmaSalva = sessionStorage.getItem("turmaSelecionadaId");
                const existeTurma = turmas.some(t => String(t.idTurma || t.id) === String(turmaSalva));
                if (turmaSalva && existeTurma) {
                    select.value = turmaSalva;
                }
            }
        } catch (erro) {
            console.error("Erro no carregamento das turmas:", erro);
            if (this.elements.selectTurma) {
                this.elements.selectTurma.innerHTML = '<option value="1">Turma 1</option>';
            }
        } finally {
            this.sincronizarTudoDaTurma(true);
        }
    },

    async sincronizarTudoDaTurma(exibirLoadingInicial = false) {
        const idTurma = this.getTurmaId();
        const { dataAtual, diaSelecionado } = this.state;
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();
        const dataIso = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`;
        this.state.dataIsoSelecionada = dataIso;

        if (exibirLoadingInicial) {
            this.renderizarGrid();
            const htmlSpinner = '<div class="spinner-container"><div class="spinner-loader"></div></div>';
            if (this.elements.containerAlocadas) this.elements.containerAlocadas.innerHTML = htmlSpinner;
            if (this.elements.containerDisponiveis) this.elements.containerDisponiveis.innerHTML = htmlSpinner;
        }

        try {
            const [resAlocadasMes, resDia] = await Promise.all([
                fetch(`/calendario/fichas-alocadas?idTurma=${idTurma}`),
                fetch(`/calendario/fichas?data=${dataIso}&idTurma=${idTurma}`)
            ]);

            if (resAlocadasMes.ok) {
                const agendamentosBrutos = await resAlocadasMes.json();
                this.state.cacheAgendamentos = agendamentosBrutos
                    .map(ag => this.extrairAgendamento(ag))
                    .filter(ag => ag.dataIso !== null);
                this.recalcularMapaDeBolinhas();
            }

            if (resDia.ok) {
                const dadosDia = await resDia.json();
                const disponiveisBrutas = dadosDia.disponiveis || dadosDia.Disponiveis || [];
                const idsAlocadosNaTurma = new Set(this.state.cacheAgendamentos.map(a => String(a.idFicha)));

                this.state.cacheDisponiveis = disponiveisBrutas
                    .map(item => this.extrairFichaDisponivel(item))
                    .filter(f => f.idFicha != null && !idsAlocadosNaTurma.has(String(f.idFicha)));
            }

            this.atualizarBolinhasNoGrid();
            this.renderizarPainelDoCache(this.state.dataIsoSelecionada);
        } catch (erro) {
            console.error("Erro ao sincronizar dados da turma:", erro);
        }
    },

    recalcularMapaDeBolinhas() {
        this.state.alocacoesPorData = {};
        this.state.cacheAgendamentos.forEach(ag => {
            if (ag.dataIso) {
                this.state.alocacoesPorData[ag.dataIso] = (this.state.alocacoesPorData[ag.dataIso] || 0) + 1;
            }
        });
    },

    // =========================================================
    // TROCA DE DIA INSTANTÂNEA PRESERVANDO FICHAS EM LOADING
    // =========================================================
    selecionarDiaInstantaneo(dia) {
        const { dataAtual } = this.state;
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();
        const dataIso = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        this.state.diaSelecionado = dia;
        this.state.dataIsoSelecionada = dataIso;

        this.renderizarPainelDoCache(dataIso);
        this.sincronizarDiaEmBackground(dataIso);
    },

    renderizarPainelDoCache(dataIso) {
        const { labelDataPainel, containerAlocadas, containerDisponiveis } = this.elements;
        if (!dataIso || !containerAlocadas || !containerDisponiveis) return;

        const [anoStr, mesStr, diaStr] = dataIso.split("-");
        const diaNum = parseInt(diaStr, 10);
        const mesIndex = parseInt(mesStr, 10) - 1;

        if (labelDataPainel) {
            labelDataPainel.textContent = `${diaNum} De ${this.nomesMeses[mesIndex]}, ${anoStr}`;
        }

        const alocadasHoje = this.state.cacheAgendamentos.filter(ag => ag.dataIso === dataIso);
        const idsAlocadosNaTurma = new Set(this.state.cacheAgendamentos.map(a => String(a.idFicha)));
        const disponiveis = this.state.cacheDisponiveis.filter(f => !idsAlocadosNaTurma.has(String(f.idFicha)));

        containerAlocadas.innerHTML = "";
        containerDisponiveis.innerHTML = "";

        if (alocadasHoje.length === 0) {
            containerAlocadas.innerHTML = '<p class="crumb-muted msg-vazia">Nenhuma aula programada para este dia.</p>';
        } else {
            alocadasHoje.forEach(ag => {
                containerAlocadas.appendChild(this.criarCardFicha({
                    id: ag.idAgendamento,
                    idFicha: ag.idFicha,
                    nome: ag.nome
                }, "delete"));
            });
        }

        if (disponiveis.length === 0) {
            containerDisponiveis.innerHTML = '<p class="crumb-muted msg-vazia">Acervo vazio ou todas já agendadas.</p>';
        } else {
            disponiveis.forEach(ficha => {
                containerDisponiveis.appendChild(this.criarCardFicha({
                    id: ficha.idFicha,
                    idFicha: ficha.idFicha,
                    nome: ficha.nome
                }, "append"));
            });
        }
    },

    async sincronizarDiaEmBackground(dataIso) {
        if (this.state.fichasAlocando.size > 0 || this.state.agendamentosDesalocando.size > 0) return;

        if (this.state.abortControllerDia) {
            this.state.abortControllerDia.abort();
        }
        this.state.abortControllerDia = new AbortController();

        const idTurma = this.getTurmaId();
        try {
            const response = await fetch(`/calendario/fichas?data=${dataIso}&idTurma=${idTurma}`, {
                signal: this.state.abortControllerDia.signal
            });
            if (!response.ok) return;

            const dados = await response.json();
            if (this.state.fichasAlocando.size > 0 || this.state.agendamentosDesalocando.size > 0) return;

            const alocadasValidasDoDia = (dados.alocadas || [])
                .map(ag => this.extrairAgendamento(ag))
                .filter(ag => !ag.dataIso || ag.dataIso === dataIso)
                .map(ag => ({ ...ag, dataIso: ag.dataIso || dataIso }));

            const disponiveisServidor = (dados.disponiveis || dados.Disponiveis || [])
                .map(item => this.extrairFichaDisponivel(item));

            this.state.cacheAgendamentos = [
                ...this.state.cacheAgendamentos.filter(ag => ag.dataIso !== dataIso),
                ...alocadasValidasDoDia
            ];

            const idsAlocadosNaTurma = new Set(this.state.cacheAgendamentos.map(a => String(a.idFicha)));
            this.state.cacheDisponiveis = disponiveisServidor.filter(
                f => f.idFicha != null && !idsAlocadosNaTurma.has(String(f.idFicha))
            );

            this.recalcularMapaDeBolinhas();
            this.atualizarBolinhasNoGrid();

            if (this.state.dataIsoSelecionada === dataIso &&
                this.state.fichasAlocando.size === 0 &&
                this.state.agendamentosDesalocando.size === 0) {
                this.renderizarPainelDoCache(dataIso);
            }
        } catch (e) {
            // Ignora AbortError
        }
    },

    // =========================================================
    // ALOCAR FICHA (COM TRAVA GLOBAL ENTRE TODOS OS DIAS)
    // =========================================================
    async alocarFicha(cardElement, idFicha, nomeFicha, dataIsoAlocacao) {
        if (!idFicha || !dataIsoAlocacao) return;

        const chaveFicha = String(idFicha);

        if (this.state.fichasAlocando.has(chaveFicha)) return;
        if (this.state.cacheAgendamentos.some(a => String(a.idFicha) === chaveFicha)) return;

        this.state.fichasAlocando.add(chaveFicha);

        const idTurma = this.getTurmaId();
        if (cardElement) {
            cardElement.setAttribute("data-loading", "true");
            cardElement.classList.add("is-loading");
            const btnElement = cardElement.querySelector(".btn-fiche-action");
            if (btnElement) {
                btnElement.disabled = true;
                btnElement.classList.add("loading");
                btnElement.innerHTML = '<span class="spinner-btn"></span>';
            }
        }

        const bodyData = new URLSearchParams();
        bodyData.append("idFicha", chaveFicha);
        bodyData.append("id", chaveFicha);
        bodyData.append("idTurma", String(idTurma));
        bodyData.append("data", String(dataIsoAlocacao));

        try {
            const response = await fetch("/calendario/alocar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: bodyData.toString()
            });

            if (!response.ok) {
                throw new Error((await response.text()) || "Erro ao alocar ficha.");
            }

            const resAlocadas = await fetch(`/calendario/fichas-alocadas?idTurma=${idTurma}`);
            let realIdAgendamento = idFicha;

            if (resAlocadas.ok) {
                const agendamentosBrutos = await resAlocadas.json();
                this.state.cacheAgendamentos = agendamentosBrutos
                    .map(ag => this.extrairAgendamento(ag))
                    .filter(ag => ag.dataIso !== null);

                const recemCriado = this.state.cacheAgendamentos.find(
                    a => String(a.idFicha) === chaveFicha && a.dataIso === dataIsoAlocacao
                );
                if (recemCriado) {
                    realIdAgendamento = recemCriado.idAgendamento;
                }
            } else {
                this.state.cacheAgendamentos.push({
                    idAgendamento: realIdAgendamento,
                    idFicha: idFicha,
                    nome: nomeFicha,
                    dataIso: dataIsoAlocacao
                });
            }

            this.state.fichasAlocando.delete(chaveFicha);
            this.state.cacheDisponiveis = this.state.cacheDisponiveis.filter(
                f => String(f.idFicha) !== chaveFicha
            );
            this.recalcularMapaDeBolinhas();
            this.atualizarBolinhasNoGrid();

            if (this.elements.containerDisponiveis) {
                const cardNaTelaAtual = this.elements.containerDisponiveis.querySelector(
                    `.fiche-card[data-id-ficha="${chaveFicha}"]`
                );
                if (cardNaTelaAtual) cardNaTelaAtual.remove();

                if (!this.elements.containerDisponiveis.querySelector(".fiche-card")) {
                    this.elements.containerDisponiveis.innerHTML = '<p class="crumb-muted msg-vazia">Acervo vazio ou todas já agendadas.</p>';
                }
            }

            if (this.state.dataIsoSelecionada === dataIsoAlocacao && this.elements.containerAlocadas) {
                const msgVaziaAlocadas = this.elements.containerAlocadas.querySelector(".msg-vazia");
                if (msgVaziaAlocadas) msgVaziaAlocadas.remove();

                const jaExisteAlocadoNoDom = this.elements.containerAlocadas.querySelector(
                    `.fiche-card[data-id-ficha="${chaveFicha}"]`
                );
                if (!jaExisteAlocadoNoDom) {
                    const novoCardAlocado = this.criarCardFicha({
                        id: realIdAgendamento,
                        idFicha: idFicha,
                        nome: nomeFicha
                    }, "delete");

                    this.elements.containerAlocadas.appendChild(novoCardAlocado);
                }
            }

        } catch (erro) {
            console.error("Erro na alocação:", erro);
            this.state.fichasAlocando.delete(chaveFicha);
            alert(erro.message || "Não foi possível agendar a ficha.");

            if (this.elements.containerDisponiveis) {
                const cardNaTelaAtual = this.elements.containerDisponiveis.querySelector(
                    `.fiche-card[data-id-ficha="${chaveFicha}"]`
                );
                if (cardNaTelaAtual) {
                    cardNaTelaAtual.removeAttribute("data-loading");
                    cardNaTelaAtual.classList.remove("is-loading");
                    const btn = cardNaTelaAtual.querySelector(".btn-fiche-action");
                    if (btn) {
                        btn.classList.remove("loading");
                        btn.disabled = false;
                        btn.innerHTML = '<span class="material-symbols-outlined">add</span>';
                    }
                }
            }
        }
    },

    // =========================================================
    // DESALOCAR FICHA (COM TRAVA GLOBAL ENTRE TODOS OS DIAS)
    // =========================================================
    async desalocarFicha(cardElement, idAgendamento, nomeFicha, idFicha) {
        if (!idAgendamento) return;

        const chaveAgendamento = String(idAgendamento);
        if (this.state.agendamentosDesalocando.has(chaveAgendamento)) return;

        this.state.agendamentosDesalocando.add(chaveAgendamento);
        const dataIsoDesalocacao = this.state.dataIsoSelecionada;

        if (cardElement) {
            cardElement.setAttribute("data-loading", "true");
            cardElement.classList.add("is-loading");
            const btnElement = cardElement.querySelector(".btn-fiche-action");
            if (btnElement) {
                btnElement.disabled = true;
                btnElement.classList.add("loading");
                btnElement.innerHTML = '<span class="spinner-btn"></span>';
            }
        }

        const bodyData = new URLSearchParams();
        bodyData.append("id", chaveAgendamento);

        try {
            const response = await fetch("/calendario/desalocar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: bodyData.toString()
            });

            if (!response.ok) throw new Error("Erro ao desalocar ficha.");

            const fichaIdReal = idFicha || (cardElement && cardElement.getAttribute("data-id-ficha")) || idAgendamento;

            this.state.agendamentosDesalocando.delete(chaveAgendamento);
            this.state.cacheAgendamentos = this.state.cacheAgendamentos.filter(
                ag => String(ag.idAgendamento) !== chaveAgendamento
            );
            if (!this.state.cacheDisponiveis.some(f => String(f.idFicha) === String(fichaIdReal))) {
                this.state.cacheDisponiveis.push({ idFicha: fichaIdReal, nome: nomeFicha });
            }
            this.recalcularMapaDeBolinhas();
            this.atualizarBolinhasNoGrid();

            if (this.state.dataIsoSelecionada === dataIsoDesalocacao && this.elements.containerAlocadas) {
                const cardAlocadoNaTela = this.elements.containerAlocadas.querySelector(
                    `.fiche-card[data-id="${chaveAgendamento}"]`
                );
                if (cardAlocadoNaTela) cardAlocadoNaTela.remove();

                if (!this.elements.containerAlocadas.querySelector(".fiche-card")) {
                    this.elements.containerAlocadas.innerHTML = '<p class="crumb-muted msg-vazia">Nenhuma aula programada para este dia.</p>';
                }
            }

            if (this.elements.containerDisponiveis) {
                const msgVaziaDisponiveis = this.elements.containerDisponiveis.querySelector(".msg-vazia");
                if (msgVaziaDisponiveis) msgVaziaDisponiveis.remove();

                const jaExisteNoDom = this.elements.containerDisponiveis.querySelector(
                    `.fiche-card[data-id-ficha="${fichaIdReal}"]`
                );
                if (!jaExisteNoDom) {
                    const novoCardDisponivel = this.criarCardFicha({
                        id: fichaIdReal,
                        idFicha: fichaIdReal,
                        nome: nomeFicha
                    }, "append");

                    this.elements.containerDisponiveis.appendChild(novoCardDisponivel);
                }
            }

        } catch (erro) {
            console.error("Erro ao remover ficha:", erro);
            this.state.agendamentosDesalocando.delete(chaveAgendamento);
            alert("Ocorreu um erro ao retirar a ficha do agendamento.");

            if (this.elements.containerAlocadas) {
                const cardAlocadoNaTela = this.elements.containerAlocadas.querySelector(
                    `.fiche-card[data-id="${chaveAgendamento}"]`
                );
                if (cardAlocadoNaTela) {
                    cardAlocadoNaTela.removeAttribute("data-loading");
                    cardAlocadoNaTela.classList.remove("is-loading");
                    const btn = cardAlocadoNaTela.querySelector(".btn-fiche-action");
                    if (btn) {
                        btn.classList.remove("loading");
                        btn.disabled = false;
                        btn.innerHTML = '<span class="material-symbols-outlined">close</span>';
                    }
                }
            }
        }
    },

    // =========================================================
    // MONTAGEM DO GRID E BOLINHAS INDICADORAS
    // =========================================================
    atualizarBolinhasNoGrid() {
        const { grid } = this.elements;
        if (!grid) return;

        grid.querySelectorAll(".day-cell[data-date]").forEach(celula => {
            const dataIso = celula.getAttribute("data-date");
            const qtdFichas = this.state.alocacoesPorData[dataIso] || 0;

            const containerAntigo = celula.querySelector(".indicator-dots");
            if (containerAntigo) containerAntigo.remove();

            if (qtdFichas > 0) {
                const dotsContainer = document.createElement("div");
                dotsContainer.className = "indicator-dots";
                Object.assign(dotsContainer.style, {
                    display: "flex",
                    gap: "3px",
                    justifyContent: "flex-end",
                    marginLeft: "auto",
                    marginTop: "auto"
                });

                for (let k = 0; k < qtdFichas; k++) {
                    const dot = document.createElement("div");
                    dot.className = "dot orange";
                    dotsContainer.appendChild(dot);
                }
                celula.appendChild(dotsContainer);
            }
        });
    },

    renderizarGrid() {
        const { grid, indicadorMes } = this.elements;
        if (!grid) return;

        grid.innerHTML = "";
        const { dataAtual } = this.state;
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        if (indicadorMes) indicadorMes.textContent = `${this.nomesMeses[mes]} ${ano}`;

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

        if (this.state.diaSelecionado > totalDiasNoMes) {
            this.state.diaSelecionado = totalDiasNoMes;
        }

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

            if (dia === this.state.diaSelecionado) {
                celula.classList.add("active-selected");
                this.state.dataIsoSelecionada = dataIso;
            }

            celula.addEventListener("click", () => {
                grid.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                this.selecionarDiaInstantaneo(dia);
            });

            grid.appendChild(celula);
        }

        this.atualizarBolinhasNoGrid();
    },

    // =========================================================
    // CRIAÇÃO DO CARD (SEM O STATUS ABAIXO DO NOME DA FICHA)
    // =========================================================
    criarCardFicha(item, acaoOuStatus, acaoOpcional) {
        // Suporta tanto criarCardFicha(item, "delete") quanto criarCardFicha(item, "success", "delete")
        const acao = acaoOpcional || acaoOuStatus;
        const id = item.id;
        const idFicha = item.idFicha || id;
        const nome = item.nome || "Ficha sem título";

        const estaCarregando = (acao === "append" && this.state.fichasAlocando.has(String(idFicha))) ||
            (acao === "delete" && this.state.agendamentosDesalocando.has(String(id)));

        const card = document.createElement("div");
        card.className = `fiche-card${estaCarregando ? " is-loading" : ""}`;
        card.setAttribute("data-id", id);
        card.setAttribute("data-id-ficha", idFicha);
        if (estaCarregando) {
            card.setAttribute("data-loading", "true");
        }

        const conteudoBotao = estaCarregando
            ? '<span class="spinner-btn"></span>'
            : `<span class="material-symbols-outlined">${acao === "delete" ? "close" : "add"}</span>`;

        card.innerHTML = `
            <div class="fiche-info">
                <p class="fiche-name" style="margin: 0;">${nome}</p>
            </div>
            <button class="btn-fiche-action ${acao}${estaCarregando ? " loading" : ""}" 
                    ${estaCarregando ? "disabled" : ""} 
                    title="${acao === "delete" ? "Remover do agendamento" : "Agendar para este dia"}">
                ${conteudoBotao}
            </button>
        `;

        const btnAcao = card.querySelector(".btn-fiche-action");

        if (acao === "append") {
            btnAcao.addEventListener("click", (e) => {
                e.preventDefault();
                const celulaAtiva = document.querySelector(".day-cell.active-selected");
                const dataIso = celulaAtiva ? celulaAtiva.getAttribute("data-date") : this.state.dataIsoSelecionada;
                if (dataIso) {
                    this.alocarFicha(card, idFicha, nome, dataIso);
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