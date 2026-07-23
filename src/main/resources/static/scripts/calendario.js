document.addEventListener("DOMContentLoaded", () => {
    // ===== ESTADO GLOBAL =====
    let dataCalendario = new Date();
    let diaSelecionadoGlobal = new Date().getDate();
    let turmaAtivaId = null;

    // Mapa de contagem de fichas por data -> { "2026-07-22": 2 }
    let contagemFichasPorData = {};

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // ===== ELEMENTOS DA DOM =====
    const grid = document.getElementById("cal-grid");
    const indicadorMes = document.getElementById("cal-month");
    const labelDataPainel = document.getElementById("cal-panel-date");
    const containerAlocadas = document.getElementById("cal-allocated");
    const containerDisponiveis = document.getElementById("cal-available");
    const btnPrev = document.getElementById("cal-prev");
    const btnNext = document.getElementById("cal-next");
    const selectTurma = document.getElementById('selectTurma');

    // Modais de confirmação
    const dialogConfirmacao = document.getElementById("modal-confirmacao");
    const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");
    const btnCancelarExclusao = document.getElementById("btn-cancelar-exclusao");

    let fichaPendenteDesalocacao = null;

    /**
     * Helper para requisições padronizadas
     */
    function fetchApi(url, options = {}) {
        const token = document.querySelector("meta[name='_csrf']")?.getAttribute("content");
        const headerName = document.querySelector("meta[name='_csrf_header']")?.getAttribute("content");

        const defaultHeaders = { 'Content-Type': 'application/json' };
        if (token && headerName) {
            defaultHeaders[headerName] = token;
        }

        const defaultOptions = {
            credentials: 'include',
            headers: { ...defaultHeaders, ...options.headers }
        };

        return fetch(url, { ...defaultOptions, ...options })
            .then(response => {
                if (response.status === 401) {
                    alert("Sua sessão expirou. Redirecionando para a tela de login.");
                    window.location.href = "/login";
                    throw new Error("Sessão expirada");
                }
                return response;
            });
    }

    /* ======================================================
       1. INICIALIZAÇÃO E CARREGAMENTO DAS TURMAS
       ====================================================== */
    function inicializarSistema() {
        if (!selectTurma) return;

        fetchApi('/api/agendamentos/turmas')
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar turmas.");
                return res.json();
            })
            .then(turmas => {
                selectTurma.innerHTML = '';
                if (!turmas || turmas.length === 0) {
                    selectTurma.innerHTML = '<option value="">Nenhuma turma vinculada</option>';
                    atualizarEExibirCalendario();
                    return;
                }

                turmas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma.id;
                    option.textContent = `${turma.nomeTurma || turma.nome || 'Turma'} (${turma.laboratorio || 'Geral'})`;
                    selectTurma.appendChild(option);
                });

                turmaAtivaId = selectTurma.value;
                atualizarEExibirCalendario();
            })
            .catch(err => {
                console.error("Erro na inicialização:", err);
                atualizarEExibirCalendario();
            });
    }

    if (selectTurma) {
        selectTurma.addEventListener('change', (e) => {
            turmaAtivaId = e.target.value;
            atualizarEExibirCalendario();
        });
    }

    /* ======================================================
       2. BUSCA DO RESUMO MENSAL (BOLINHAS)
       ====================================================== */
    function carregarAgendamentosDoMes() {
        if (!turmaAtivaId) return Promise.resolve();

        const ano = dataCalendario.getFullYear();
        const mes = dataCalendario.getMonth() + 1;

        return fetchApi(`/api/agendamentos/mes?ano=${ano}&mes=${mes}&idTurma=${turmaAtivaId}`)
            .then(res => res.ok ? res.json() : {})
            .then(mapaContagem => {
                contagemFichasPorData = mapaContagem || {};
            })
            .catch(err => {
                console.warn("Erro ao buscar resumo das bolinhas:", err);
                contagemFichasPorData = {};
            });
    }

    function atualizarEExibirCalendario() {
        carregarAgendamentosDoMes().finally(() => {
            renderizarGrid();
        });
    }

    /* ======================================================
       3. RENDERIZAÇÃO DO GRID DO CALENDÁRIO
       ====================================================== */
    function renderizarGrid() {
        if (!grid) return;
        grid.innerHTML = "";

        const ano = dataCalendario.getFullYear();
        const mes = dataCalendario.getMonth();

        if (indicadorMes) indicadorMes.textContent = `${nomesMeses[mes]} ${ano}`;

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

        if (diaSelecionadoGlobal > totalDiasNoMes) {
            diaSelecionadoGlobal = totalDiasNoMes;
        }

        // Preenche células vazias no início do mês
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        // Renderiza cada dia do mês
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const celula = document.createElement("div");
            celula.className = "day-cell";

            const spanNumero = document.createElement("span");
            spanNumero.textContent = dia;
            celula.appendChild(spanNumero);

            const strMes = String(mes + 1).padStart(2, '0');
            const strDia = String(dia).padStart(2, '0');
            const dataIso = `${ano}-${strMes}-${strDia}`;
            celula.setAttribute("data-date", dataIso);

            // ----- BLOQUEIO E VERIFICAÇÃO DE FINS DE SEMANA (SÁB = 6, DOM = 0) -----
            const diaSemana = new Date(ano, mes, dia).getDay();
            const ehFimDeSemana = (diaSemana === 0 || diaSemana === 6);

            if (ehFimDeSemana) {
                // Aplica as classes CSS de bloqueio e desativa a célula
                celula.classList.add("weekend", "bloqueado");
            } else {
                // RENDERIZAÇÃO DAS BOLINHAS (INDICATOR DOTS) APENAS PARA DIAS ÚTEIS
                const qtdFichas = contagemFichasPorData[dataIso] || 0;
                if (qtdFichas > 0) {
                    const indicatorContainer = document.createElement("div");
                    indicatorContainer.className = "indicator-dots";

                    const totalBolinhas = Math.min(qtdFichas, 3);
                    for (let b = 0; b < totalBolinhas; b++) {
                        const dot = document.createElement("span");
                        dot.className = "dot orange";
                        indicatorContainer.appendChild(dot);
                    }
                    celula.appendChild(indicatorContainer);
                }

                // Seleção inicial / Ativação do dia útil
                if (dia === diaSelecionadoGlobal) {
                    celula.classList.add("active-selected");
                    buscarAgendamentos(dataIso, dia, nomesMeses[mes], ano);
                }

                // Evento de clique para dias úteis
                celula.addEventListener("click", () => {
                    document.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                    celula.classList.add("active-selected");
                    diaSelecionadoGlobal = dia;
                    buscarAgendamentos(dataIso, dia, nomesMeses[mes], ano);
                });
            }

            grid.appendChild(celula);
        }
    }

    /* ======================================================
       4. PAINEL LATERAL (FICHAS ALOCADAS / DISPONÍVEIS)
       ====================================================== */
    function buscarAgendamentos(dataIso, dia, nomeMes, ano) {
        if (labelDataPainel) labelDataPainel.textContent = `${dia} De ${nomeMes}, ${ano}`;

        if (containerAlocadas) containerAlocadas.innerHTML = '<p class="crumb-muted">Carregando...</p>';
        if (containerDisponiveis) containerDisponiveis.innerHTML = '<p class="crumb-muted">Carregando...</p>';

        if (!turmaAtivaId) {
            if (containerAlocadas) containerAlocadas.innerHTML = '<p class="crumb-muted">Selecione uma turma.</p>';
            if (containerDisponiveis) containerDisponiveis.innerHTML = '<p class="crumb-muted">Selecione uma turma.</p>';
            return;
        }

        fetchApi(`/calendario/fichas?data=${dataIso}&idTurma=${turmaAtivaId}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar fichas.");
                return res.json();
            })
            .then(data => {
                const alocadas = data.alocadas || [];
                const todasFichas = data.Disponiveis || [];

                if (containerAlocadas) {
                    containerAlocadas.innerHTML = "";
                    if (alocadas.length === 0) {
                        containerAlocadas.innerHTML = '<p class="crumb-muted">Nenhuma ficha agendada para este dia.</p>';
                    } else {
                        alocadas.forEach(ficha => {
                            const nome = ficha.nome || ficha.nomePrato || ficha.nomeFicha || 'Ficha Técnica';
                            containerAlocadas.appendChild(criarCardFicha(ficha.id, nome, 'delete', dataIso));
                        });
                    }
                }

                if (containerDisponiveis) {
                    containerDisponiveis.innerHTML = "";
                    const idsAlocados = alocadas.map(f => f.id);
                    const disponiveisParaExibir = todasFichas.filter(f => !idsAlocados.includes(f.id));

                    if (disponiveisParaExibir.length === 0) {
                        containerDisponiveis.innerHTML = '<p class="crumb-muted">Nenhuma ficha disponível para agendar.</p>';
                    } else {
                        disponiveisParaExibir.forEach(ficha => {
                            const nome = ficha.nome || ficha.nomePrato || ficha.nomeFicha || 'Ficha Técnica';
                            containerDisponiveis.appendChild(criarCardFicha(ficha.id, nome, 'append', dataIso));
                        });
                    }
                }
            })
            .catch(err => {
                console.error("Erro ao carregar fichas:", err);
                if (containerAlocadas) containerAlocadas.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
                if (containerDisponiveis) containerDisponiveis.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
            });
    }

    function criarCardFicha(fichaId, nomeFicha, acao, dataIso) {
        const card = document.createElement("div");
        card.className = "fiche-card";

        card.innerHTML = `
            <div class="fiche-info">
                <p class="fiche-name">${nomeFicha}</p>
            </div>
            <button class="btn-fiche-action ${acao}">
                <span class="material-symbols-outlined">${acao === 'delete' ? 'close' : 'add'}</span>
            </button>
        `;

        const btnAcao = card.querySelector('.btn-fiche-action');

        btnAcao.addEventListener('click', () => {
            if (acao === 'append') {
                executarAlocacao(fichaId, turmaAtivaId, dataIso, btnAcao);
            } else if (acao === 'delete') {
                abrirModalDesalocacao(fichaId, dataIso, btnAcao);
            }
        });

        return card;
    }

    /* ======================================================
       5. AÇÕES REST (ALOCAR E DESALOCAR COM RE-RENDER)
       ====================================================== */
    function executarAlocacao(fichaId, turmaId, dataIso, btnElement) {
        btnElement.disabled = true;

        const payload = {
            fichaId: parseInt(fichaId),
            turmaId: parseInt(turmaId),
            data: dataIso
        };

        fetchApi('/api/agendamentos/alocar', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || 'Erro ao agendar ficha');
                }
                return res.json();
            })
            .then(() => {
                atualizarEExibirCalendario();
            })
            .catch(err => {
                alert(err.message);
                btnElement.disabled = false;
            });
    }

    function executarDesalocacao(fichaId, turmaId, dataIso, btnElement) {
        if (btnElement) btnElement.disabled = true;

        const payload = {
            fichaId: parseInt(fichaId),
            turmaId: parseInt(turmaId),
            data: dataIso
        };

        fetchApi('/api/agendamentos/desalocar', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || 'Erro ao desalocar ficha');
                }
                return res.json();
            })
            .then(() => {
                atualizarEExibirCalendario();
            })
            .catch(err => {
                alert(err.message);
                if (btnElement) btnElement.disabled = false;
            });
    }

    // Modal de Confirmação de Exclusão
    function abrirModalDesalocacao(fichaId, dataIso, btnElement) {
        fichaPendenteDesalocacao = { fichaId, dataIso, btnElement };
        if (dialogConfirmacao) {
            if (typeof dialogConfirmacao.showModal === "function") {
                dialogConfirmacao.showModal();
            } else {
                dialogConfirmacao.setAttribute("open", "true");
            }
        } else {
            if (confirm("Deseja mesmo retirar a ficha deste dia?")) {
                executarDesalocacao(fichaId, turmaAtivaId, dataIso, btnElement);
            }
        }
    }

    if (btnCancelarExclusao) {
        btnCancelarExclusao.addEventListener("click", () => {
            if (dialogConfirmacao) dialogConfirmacao.close();
            fichaPendenteDesalocacao = null;
        });
    }

    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener("click", () => {
            if (fichaPendenteDesalocacao) {
                const { fichaId, dataIso, btnElement } = fichaPendenteDesalocacao;
                if (dialogConfirmacao) dialogConfirmacao.close();
                executarDesalocacao(fichaId, turmaAtivaId, dataIso, btnElement);
            }
        });
    }

    // Navegação entre meses
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() - 1);
            atualizarEExibirCalendario();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() + 1);
            atualizarEExibirCalendario();
        });
    }

    // Execução Inicial
    inicializarSistema();
});