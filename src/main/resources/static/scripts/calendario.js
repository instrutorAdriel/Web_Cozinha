
const CalendarioSIGEC = {

    // ==========================================
    // 1. CONTROLE DE ESTADO
    // ==========================================
    state: {
        dataAtual: new Date(),
        diaSelecionado: new Date().getDate(),
        alocacoesPorData: {},
        fichaIdDesalocar: null
    },

    // ==========================================
    // 2. ELEMENTOS DOM
    // ==========================================
    elements: {
        selectTurma: document.getElementById("turma-select") ||
            document.getElementById("select-turma"),

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
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ],

    // ==========================================
    // 3. INICIALIZAÇÃO
    // ==========================================
    init() {
        this.bindEvents();
        this.carregarTurmas();
    },

    getTurmaId() {
        return this.elements.selectTurma
            ? this.elements.selectTurma.value
            : null;
    },

    // ==========================================
    // 4. CONTROLE DE FERIADOS
    // ==========================================

    obterDataPascoa(ano) {
        // Algoritmo de cálculo da Páscoa (calendário gregoriano)
        const a = ano % 19;
        const b = Math.floor(ano / 100);
        const c = ano % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);

        const mes = Math.floor((h + l - 7 * m + 114) / 31);
        const dia = ((h + l - 7 * m + 114) % 31) + 1;

        return new Date(ano, mes - 1, dia);
    },

    obterFeriados(ano) {
        const feriados = [
            `${ano}-01-01`,
            `${ano}-04-21`,
            `${ano}-05-01`,
            `${ano}-09-07`,
            `${ano}-10-12`,
            `${ano}-11-02`,
            `${ano}-11-15`,
            `${ano}-11-20`,
            `${ano}-12-25`
        ];

        // Sexta-feira Santa: dois dias antes da Páscoa
        const pascoa = this.obterDataPascoa(ano);
        const sextaSanta = new Date(ano, pascoa.getMonth(), pascoa.getDate() - 2);

        feriados.push(this.formatarDataISO(sextaSanta));

        return feriados;
    },

    formatarDataISO(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    },

    // ==========================================
    // 5. VALIDAÇÃO DAS DATAS
    // ==========================================

    verificarDataPermitida(dataIso) {
        if (!dataIso || !/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) {
            return {
                permitida: false,
                motivo: "Data inválida."
            };
        }

        const [ano, mes, dia] = dataIso.split("-").map(Number);

        const data = new Date(ano, mes - 1, dia);

        // Impede datas inexistentes, como 31/02
        if (
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            return {
                permitida: false,
                motivo: "Data inválida."
            };
        }

        const diaSemana = data.getDay();

        if (diaSemana === 0 || diaSemana === 6) {
            return {
                permitida: false,
                motivo: "Não é permitido agendar fichas aos finais de semana."
            };
        }

        const feriados = this.obterFeriados(ano);

        if (feriados.includes(dataIso)) {
            return {
                permitida: false,
                motivo: "Não é permitido agendar fichas em feriados."
            };
        }

        return {
            permitida: true,
            motivo: ""
        };
    },

    // ==========================================
    // 6. SELEÇÃO AUTOMÁTICA DE DIA VÁLIDO
    // ==========================================

    obterPrimeiroDiaValido(ano, mes, diaPreferido = 1) {
        const totalDias = new Date(ano, mes + 1, 0).getDate();

        // Primeiro tenta manter o mesmo número de dia
        for (let dia = Math.min(diaPreferido, totalDias); dia <= totalDias; dia++) {
            const dataIso = this.formatarDataISO(
                new Date(ano, mes, dia)
            );

            if (this.verificarDataPermitida(dataIso).permitida) {
                return dia;
            }
        }

        // Se não encontrar, procura desde o início do mês
        for (let dia = 1; dia < Math.min(diaPreferido, totalDias + 1); dia++) {
            const dataIso = this.formatarDataISO(
                new Date(ano, mes, dia)
            );

            if (this.verificarDataPermitida(dataIso).permitida) {
                return dia;
            }
        }

        return null;
    },

    // ==========================================
    // 7. EVENTOS
    // ==========================================

    bindEvents() {
        const {
            selectTurma,
            btnPrev,
            btnNext,
            btnCancelarExclusao,
            btnConfirmarExclusao
        } = this.elements;

        if (selectTurma) {
            selectTurma.addEventListener("change", () => {
                if (selectTurma.value) {
                    sessionStorage.setItem(
                        "turmaSelecionadaId",
                        selectTurma.value
                    );
                }

                this.carregarAlocacoes();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                this.mudarMes(-1);
            });
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                this.mudarMes(1);
            });
        }

        if (btnCancelarExclusao) {
            btnCancelarExclusao.addEventListener("click", () => {
                if (this.elements.dialogConfirmacao) {
                    this.elements.dialogConfirmacao.close();
                }

                this.state.fichaIdDesalocar = null;
            });
        }

        if (btnConfirmarExclusao) {
            btnConfirmarExclusao.addEventListener("click", () => {
                this.confirmarDesalocacao();
            });
        }
    },

    // ==========================================
    // 8. NAVEGAÇÃO ENTRE MESES
    // ==========================================

    mudarMes(direcao) {
        const data = this.state.dataAtual;

        // Guarda o dia anteriormente selecionado
        const diaAnterior = this.state.diaSelecionado || 1;

        // Evita problemas do setMonth quando o dia é 29, 30 ou 31
        data.setDate(1);
        data.setMonth(data.getMonth() + direcao);

        const ano = data.getFullYear();
        const mes = data.getMonth();

        // Seleciona um dia permitido no novo mês
        this.state.diaSelecionado = this.obterPrimeiroDiaValido(
            ano,
            mes,
            diaAnterior
        );

        this.carregarAlocacoes();
    },

    // ==========================================
    // 9. CARREGAR TURMAS
    // ==========================================

    async carregarTurmas() {
        if (!this.elements.selectTurma) {
            this.carregarAlocacoes();
            return;
        }

        try {
            const response = await fetch("/turmas/usuario");

            if (!response.ok) {
                throw new Error("Erro ao carregar turmas.");
            }

            const turmas = await response.json();
            const select = this.elements.selectTurma;

            select.innerHTML = "";

            if (turmas.length === 0) {
                select.innerHTML =
                    '<option value="">Nenhuma turma vinculada</option>';
            } else {
                turmas.forEach(turma => {
                    const id = turma.idTurma || turma.id;
                    const nomeTurma =
                        turma.nomeTurma || turma.nome || "Turma sem nome";

                    let labNome = "";

                    if (
                        typeof turma.laboratorio === "object" &&
                        turma.laboratorio !== null
                    ) {
                        labNome =
                            turma.laboratorio.nomeLaboratorio || "";
                    } else if (
                        typeof turma.laboratorio === "string"
                    ) {
                        labNome = turma.laboratorio;
                    }

                    const textoOpcao = labNome
                        ? `${nomeTurma} - ${labNome}`
                        : nomeTurma;

                    select.appendChild(
                        new Option(textoOpcao, id)
                    );
                });

                const turmaSalva = sessionStorage.getItem(
                    "turmaSelecionadaId"
                );

                const existeTurma = turmas.some(
                    t => String(t.idTurma || t.id) === turmaSalva
                );

                if (turmaSalva && existeTurma) {
                    select.value = turmaSalva;
                }
            }

        } catch (erro) {
            console.error("Erro no carregamento das turmas:", erro);

            this.elements.selectTurma.innerHTML =
                '<option value="">Erro ao carregar turmas</option>';

        } finally {
            this.carregarAlocacoes();
        }
    },

    // ==========================================
    // 10. CARREGAR ALOCAÇÕES
    // ==========================================

    async carregarAlocacoes() {
        const idTurma = this.getTurmaId();

        const url = idTurma
            ? `/calendario/fichas-alocadas?idTurma=${encodeURIComponent(idTurma)}`
            : "/calendario/fichas-alocadas";

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Erro ao carregar marcadores alocados.");
            }

            const fichas = await response.json();

            this.state.alocacoesPorData = {};

            fichas.forEach(ficha => {
                if (ficha.data) {
                    this.state.alocacoesPorData[ficha.data] =
                        (this.state.alocacoesPorData[ficha.data] || 0) + 1;
                }
            });

        } catch (erro) {
            console.error("Erro ao carregar alocações:", erro);

        } finally {
            this.renderizarGrid();
        }
    },

    // ==========================================
    // 11. BUSCAR FICHAS DO DIA
    // ==========================================

    async buscarFichasDoDia(dataIso, dia, nomeMes, ano) {
        // Proteção adicional
        const validacao = this.verificarDataPermitida(dataIso);

        if (!validacao.permitida) {
            alert(validacao.motivo);
            return;
        }

        const {
            labelDataPainel,
            containerAlocadas,
            containerDisponiveis
        } = this.elements;

        if (labelDataPainel) {
            labelDataPainel.textContent =
                `${dia} De ${nomeMes}, ${ano}`;
        }

        if (containerAlocadas) {
            containerAlocadas.innerHTML =
                '<p class="crumb-muted">A carregar agenda...</p>';
        }

        if (containerDisponiveis) {
            containerDisponiveis.innerHTML =
                '<p class="crumb-muted">A carregar acervo...</p>';
        }

        const idTurma = this.getTurmaId();

        const url = idTurma
            ? `/calendario/fichas?data=${encodeURIComponent(dataIso)}&idTurma=${encodeURIComponent(idTurma)}`
            : `/calendario/fichas?data=${encodeURIComponent(dataIso)}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Erro na resposta do servidor.");
            }

            const dados = await response.json();

            // Evita exibir resultados de uma data que deixou de estar selecionada
            if (
                this.formatarDataISO(
                    new Date(
                        this.state.dataAtual.getFullYear(),
                        this.state.dataAtual.getMonth(),
                        this.state.diaSelecionado
                    )
                ) !== dataIso
            ) {
                return;
            }

            if (containerAlocadas) {
                containerAlocadas.innerHTML = "";
            }

            if (containerDisponiveis) {
                containerDisponiveis.innerHTML = "";
            }

            const alocadas = dados.alocadas || [];
            const disponiveis =
                dados.disponiveis || dados.Disponiveis || [];

            // Fichas já alocadas
            if (alocadas.length === 0) {
                if (containerAlocadas) {
                    containerAlocadas.innerHTML =
                        '<p class="crumb-muted">Nenhuma aula ou ficha programada para este dia.</p>';
                }
            } else {
                alocadas.forEach(agendamento => {
                    const fichaObj = agendamento.ficha || agendamento;

                    const idAgendamento =
                        agendamento.idAgendamento ||
                        agendamento.id ||
                        agendamento.idFicha;

                    const nome =
                        fichaObj.nomeFicha ||
                        fichaObj.nome ||
                        fichaObj.titulo ||
                        "Ficha sem título";

                    if (containerAlocadas) {
                        containerAlocadas.appendChild(
                            this.criarCardFicha(
                                { id: idAgendamento, nome },
                                "success",
                                "delete"
                            )
                        );
                    }
                });
            }

            // Fichas disponíveis
            if (disponiveis.length === 0) {
                if (containerDisponiveis) {
                    containerDisponiveis.innerHTML =
                        '<p class="crumb-muted">Acervo vazio.</p>';
                }
            } else {
                disponiveis.forEach(ficha => {
                    const idFicha = ficha.idFicha || ficha.id;

                    const nome =
                        ficha.nomeFicha ||
                        ficha.nome ||
                        ficha.titulo ||
                        "Ficha sem título";

                    if (containerDisponiveis) {
                        containerDisponiveis.appendChild(
                            this.criarCardFicha(
                                { id: idFicha, nome },
                                "warning",
                                "append"
                            )
                        );
                    }
                });
            }

        } catch (erro) {
            console.error("Erro ao carregar fichas:", erro);

            if (containerAlocadas) {
                containerAlocadas.innerHTML =
                    '<p style="color: red;">Erro ao carregar dados.</p>';
            }

            if (containerDisponiveis) {
                containerDisponiveis.innerHTML =
                    '<p style="color: red;">Erro ao carregar dados.</p>';
            }
        }
    },

    // ==========================================
    // 12. ALOCAR FICHA
    // ==========================================

    async alocarFicha(id, dataIso) {
        if (!id || !dataIso) {
            return;
        }

        // VALIDAÇÃO OBRIGATÓRIA ANTES DE GRAVAR
        const validacao = this.verificarDataPermitida(dataIso);

        if (!validacao.permitida) {
            alert(validacao.motivo);
            return;
        }

        // Confirma que a data corresponde ao mês atualmente exibido
        const [ano, mes] = dataIso.split("-").map(Number);

        if (
            ano !== this.state.dataAtual.getFullYear() ||
            mes - 1 !== this.state.dataAtual.getMonth()
        ) {
            alert("Selecione uma data válida no calendário.");
            return;
        }

        const dataSelecionada = this.formatarDataISO(
            new Date(
                this.state.dataAtual.getFullYear(),
                this.state.dataAtual.getMonth(),
                this.state.diaSelecionado
            )
        );

        if (dataIso !== dataSelecionada) {
            alert("A data selecionada foi alterada. Selecione novamente.");
            return;
        }

        const idTurma = this.getTurmaId();

        const bodyData = new URLSearchParams();

        bodyData.append("id", String(id));
        bodyData.append("data", String(dataIso));

        if (idTurma) {
            bodyData.append("idTurma", String(idTurma));
        }

        try {
            const response = await fetch("/calendario/alocar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyData.toString()
            });

            if (!response.ok) {
                const mensagem = await response.text();

                throw new Error(
                    mensagem || "Erro ao alocar ficha."
                );
            }

            alert("Ficha agendada com sucesso!");

            await this.carregarAlocacoes();

            // Atualiza o painel do dia selecionado
            const data = new Date(
                ano,
                mes - 1,
                this.state.diaSelecionado
            );

            await this.buscarFichasDoDia(
                dataIso,
                data.getDate(),
                this.nomesMeses[data.getMonth()],
                data.getFullYear()
            );

        } catch (erro) {
            console.error("Erro na alocação:", erro);

            alert(
                "Não foi possível agendar a ficha para esta data."
            );
        }
    },

    // ==========================================
    // 13. SOLICITAR DESALOCAÇÃO
    // ==========================================

    solicitarDesalocacao(id) {
        this.state.fichaIdDesalocar = id;

        if (this.elements.dialogConfirmacao) {
            this.elements.dialogConfirmacao.showModal();
        } else {
            this.confirmarDesalocacao();
        }
    },

    // ==========================================
    // 14. CONFIRMAR DESALOCAÇÃO
    // ==========================================

    async confirmarDesalocacao() {
        if (!this.state.fichaIdDesalocar) {
            return;
        }

        const idTurma = this.getTurmaId();

        const url =
            `/calendario/desalocar?id=${encodeURIComponent(this.state.fichaIdDesalocar)}` +
            (idTurma
                ? `&idTurma=${encodeURIComponent(idTurma)}`
                : "");

        try {
            const response = await fetch(url, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Erro ao desalocar ficha.");
            }

            if (this.elements.dialogConfirmacao) {
                this.elements.dialogConfirmacao.close();
            }

            this.state.fichaIdDesalocar = null;

            await this.carregarAlocacoes();

            const dia = this.state.diaSelecionado;

            if (dia) {
                const data = new Date(
                    this.state.dataAtual.getFullYear(),
                    this.state.dataAtual.getMonth(),
                    dia
                );

                const dataIso = this.formatarDataISO(data);

                await this.buscarFichasDoDia(
                    dataIso,
                    dia,
                    this.nomesMeses[data.getMonth()],
                    data.getFullYear()
                );
            }

        } catch (erro) {
            console.error("Erro ao remover ficha:", erro);

            alert(
                "Ocorreu um erro ao tentar retirar a ficha do calendário."
            );
        }
    },

    // ==========================================
    // 15. RENDERIZAÇÃO DO CALENDÁRIO
    // ==========================================

    renderizarGrid() {
        const { grid, indicadorMes } = this.elements;

        if (!grid) {
            return;
        }

        grid.innerHTML = "";

        const ano = this.state.dataAtual.getFullYear();
        const mes = this.state.dataAtual.getMonth();

        if (indicadorMes) {
            indicadorMes.textContent =
                `${this.nomesMeses[mes]} ${ano}`;
        }

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();

        const totalDiasNoMes =
            new Date(ano, mes + 1, 0).getDate();

        // Corrige seleção inválida após alteração de mês
        if (
            !this.state.diaSelecionado ||
            this.state.diaSelecionado > totalDiasNoMes ||
            !this.verificarDataPermitida(
                this.formatarDataISO(
                    new Date(
                        ano,
                        mes,
                        this.state.diaSelecionado
                    )
                )
            ).permitida
        ) {
            this.state.diaSelecionado =
                this.obterPrimeiroDiaValido(ano, mes, 1);
        }

        // Espaços antes do primeiro dia do mês
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");

            espaco.className = "day-cell space";

            grid.appendChild(espaco);
        }

        // Montagem dos dias
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");

            celula.className = "day-cell";

            const spanNumero = document.createElement("span");

            spanNumero.textContent = dia;

            celula.appendChild(spanNumero);

            const dataIso = this.formatarDataISO(
                new Date(ano, mes, dia)
            );

            const validacao = this.verificarDataPermitida(dataIso);

            const ehFimDeSemana =
                [0, 6].includes(
                    new Date(ano, mes, dia).getDay()
                );

            const ehFeriado =
                !validacao.permitida && !ehFimDeSemana;

            // ==================================
            // DIAS BLOQUEADOS
            // ==================================

            if (!validacao.permitida) {
                celula.classList.add(
                    ehFeriado ? "holiday" : "weekend"
                );

                celula.style.pointerEvents = "none";
                celula.style.opacity = "0.4";
                celula.style.cursor = "not-allowed";

                celula.title = validacao.motivo;
            }

            celula.setAttribute("data-date", dataIso);

            // Indicadores de fichas agendadas
            const qtdFichas =
                this.state.alocacoesPorData[dataIso];

            if (qtdFichas) {
                const dotsContainer =
                    document.createElement("div");

                dotsContainer.className = "indicator-dots";

                Object.assign(dotsContainer.style, {
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

            // ==================================
            // DIA SELECIONADO
            // ==================================

            if (dia === this.state.diaSelecionado) {
                celula.classList.add("active-selected");

                this.buscarFichasDoDia(
                    dataIso,
                    dia,
                    this.nomesMeses[mes],
                    ano
                );
            }

            // ==================================
            // EVENTO DE CLIQUE
            // ==================================

            if (validacao.permitida) {
                celula.addEventListener("click", () => {

                    // Segunda proteção contra datas inválidas
                    const verificacao =
                        this.verificarDataPermitida(dataIso);

                    if (!verificacao.permitida) {
                        alert(verificacao.motivo);
                        return;
                    }

                    grid.querySelectorAll(".day-cell")
                        .forEach(c => {
                            c.classList.remove("active-selected");
                        });

                    celula.classList.add("active-selected");

                    this.state.diaSelecionado = dia;

                    this.buscarFichasDoDia(
                        dataIso,
                        dia,
                        this.nomesMeses[mes],
                        ano
                    );
                });
            }

            grid.appendChild(celula);
        }
    },

    // ==========================================
    // 16. CRIAR CARD DE FICHA
    // ==========================================

    criarCardFicha(item, status, acao) {
        const id = item.id;
        const nome = item.nome || "Ficha sem título";

        const icone =
            status === "success" ? "check_circle" : "warning";

        const textoEstoque =
            status === "success"
                ? "Estoque Completo"
                : "Verificar Insumos";

        const card = document.createElement("div");

        card.className = "fiche-card";

        const info = document.createElement("div");
        info.className = "fiche-info";

        const nomeFicha = document.createElement("p");
        nomeFicha.className = "fiche-name";
        nomeFicha.textContent = nome;

        const estoque = document.createElement("span");
        estoque.className = `stock-status ${status}`;

        const iconeElemento = document.createElement("span");
        iconeElemento.className = "material-symbols-outlined";
        iconeElemento.textContent = icone;

        estoque.appendChild(iconeElemento);
        estoque.appendChild(
            document.createTextNode(` ${textoEstoque}`)
        );

        info.appendChild(nomeFicha);
        info.appendChild(estoque);

        const btnAcao = document.createElement("button");

        btnAcao.className = `btn-fiche-action ${acao}`;

        const iconeBotao = document.createElement("span");

        iconeBotao.className = "material-symbols-outlined";

        iconeBotao.textContent =
            acao === "delete" ? "close" : "add";

        btnAcao.appendChild(iconeBotao);

        card.appendChild(info);
        card.appendChild(btnAcao);

        // ==================================
        // ADICIONAR FICHA
        // ==================================

        if (acao === "append") {
            btnAcao.addEventListener("click", () => {

                const celulaAtiva =
                    document.querySelector(
                        ".day-cell.active-selected"
                    );

                if (!celulaAtiva) {
                    alert("Selecione um dia no calendário.");
                    return;
                }

                const dataIso =
                    celulaAtiva.getAttribute("data-date");

                // Validação antes de enviar
                const validacao =
                    this.verificarDataPermitida(dataIso);

                if (!validacao.permitida) {
                    alert(validacao.motivo);
                    return;
                }

                this.alocarFicha(id, dataIso);
            });
        }

            // ==================================
            // REMOVER FICHA
        // ==================================

        else if (acao === "delete") {
            btnAcao.addEventListener("click", () => {
                this.solicitarDesalocacao(id);
            });
        }

        return card;
    }
};


// ==========================================
// 17. INICIALIZAÇÃO DO CALENDÁRIO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    CalendarioSIGEC.init();
});


// ==========================================
// 18. CONFIRMAÇÃO DE SAÍDA DO SISTEMA
// ==========================================

const btnSair = document.getElementById("btnSair");
const modalSair = document.getElementById("confirmacaoSaida");
const btnNao = document.getElementById("btnNao");
const btnSim = document.getElementById("btnSim");
const formLogout = document.getElementById("formLogout");

// Abrir confirmação
if (btnSair && modalSair) {
    btnSair.addEventListener("click", function(e) {
        e.preventDefault();
        modalSair.classList.add("show");
    });
}

// Cancelar saída
if (btnNao && modalSair) {
    btnNao.addEventListener("click", function() {
        modalSair.classList.remove("show");
    });
}

// Confirmar saída
if (btnSim && formLogout) {
    btnSim.addEventListener("click", function() {
        formLogout.submit();
    });
}

// Fechar ao clicar fora da janela
if (modalSair) {
    modalSair.addEventListener("click", function(event) {
        if (event.target === modalSair) {
            modalSair.classList.remove("show");
        }
    });
}
