document.addEventListener("DOMContentLoaded", () => {
    // Estado Global
    let dataCalendario = new Date();
    let diaSelecionadoGlobal = new Date().getDate();
    let turmaAtivaId = null;

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Elementos da DOM
    const grid = document.getElementById("cal-grid");
    const indicadorMes = document.getElementById("cal-month");
    const labelDataPainel = document.getElementById("cal-panel-date");
    const containerAlocadas = document.getElementById("cal-allocated");
    const containerDisponiveis = document.getElementById("cal-available");
    const btnPrev = document.getElementById("cal-prev");
    const btnNext = document.getElementById("cal-next");
    const selectTurma = document.getElementById('selectTurma');

    /**
     * Helper para requisições padronizadas
     */
    function fetchApi(url, options = {}) {
        const defaultOptions = {
            credentials: 'include', // Garante que o cookie JSESSIONID é mantido
            headers: { 'Content-Type': 'application/json' }
        };

        return fetch(url, { ...defaultOptions, ...options })
            .then(response => {
                // Tratamento específico de não autorizado retornado pelo SessaoService
                if (response.status === 401) {
                    alert("Sua sessão expirou. Redirecionando para a tela de login.");
                    window.location.href = "/login";
                    throw new Error("Sessão expirada");
                }
                return response;
            });
    }

    /**
     * 1. Carrega turmas via GET /api/agendamentos/turmas
     */
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
                    renderizarGrid();
                    return;
                }

                turmas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma.id;
                    option.textContent = `${turma.nomeTurma || turma.nome || 'Turma'} (${turma.laboratorio || 'Geral'})`;
                    selectTurma.appendChild(option);
                });

                turmaAtivaId = selectTurma.value;
                renderizarGrid();
            })
            .catch(err => {
                console.error("Erro na inicialização:", err);
                renderizarGrid();
            });
    }

    /**
     * Troca de Turma
     */
    if (selectTurma) {
        selectTurma.addEventListener('change', (e) => {
            turmaAtivaId = e.target.value;
            recarregarDiaAtual();
        });
    }

    /**
     * 2. Desenha o Grid do Calendário
     */
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

        // Espaços vazios
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const espaco = document.createElement("div");
            espaco.className = "day-cell space";
            grid.appendChild(espaco);
        }

        // Blocos dos dias
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

            if (dia === diaSelecionadoGlobal) {
                celula.classList.add("active-selected");
                buscarAgendamentos(dataIso, dia, nomesMeses[mes], ano);
            }

            celula.addEventListener("click", () => {
                document.querySelectorAll(".day-cell").forEach(c => c.classList.remove("active-selected"));
                celula.classList.add("active-selected");
                diaSelecionadoGlobal = dia;
                buscarAgendamentos(dataIso, dia, nomesMeses[mes], ano);
            });

            grid.appendChild(celula);
        }
    }

    /**
     * 3. Busca Agendamentos -> GET /api/agendamentos?turmaId=X&data=YYYY-MM-DD
     */
    function buscarAgendamentos(dataIso, dia, nomeMes, ano) {
        if (labelDataPainel) labelDataPainel.textContent = `${dia} De ${nomeMes}, ${ano}`;

        if (containerAlocadas) containerAlocadas.innerHTML = '<p class="crumb-muted">A carregar agendamentos...</p>';

        if (!turmaAtivaId) {
            if (containerAlocadas) containerAlocadas.innerHTML = '<p class="crumb-muted">Selecione uma turma.</p>';
            return;
        }

        fetchApi(`/api/agendamentos?turmaId=${turmaAtivaId}&data=${dataIso}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar agendamentos");
                return res.json();
            })
            .then(agendamentos => {
                if (!containerAlocadas) return;
                containerAlocadas.innerHTML = "";

                if (!agendamentos || agendamentos.length === 0) {
                    containerAlocadas.innerHTML = '<p class="crumb-muted">Nenhum agendamento para este dia.</p>';
                } else {
                    agendamentos.forEach(item => {
                        // Trata se o objeto do Spring vier com o relacionamento 'ficha' ou plano
                        const fichaObj = item.ficha || item;
                        containerAlocadas.appendChild(
                            criarCardFicha(fichaObj.id, fichaObj.nome || 'Ficha Técnica', 'delete', dataIso)
                        );
                    });
                }
            })
            .catch(err => {
                console.error("Erro ao listar agendamentos:", err);
                if (containerAlocadas) containerAlocadas.innerHTML = '<p style="color: red;">Erro ao carregar dados.</p>';
            });
    }

    /**
     * 4. Constrói a View do Card de Agendamento
     */
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
                executarDesalocacao(fichaId, turmaAtivaId, dataIso, btnAcao);
            }
        });

        return card;
    }

    /**
     * 5. Alocar Ficha -> POST /api/agendamentos/alocar
     */
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
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error || 'Erro ao agendar'); });
                }
                return res.json();
            })
            .then(() => recarregarDiaAtual())
            .catch(err => {
                alert(err.message);
                btnElement.disabled = false;
            });
    }

    /**
     * 6. Desalocar Ficha -> POST /api/agendamentos/desalocar
     */
    function executarDesalocacao(fichaId, turmaId, dataIso, btnElement) {
        btnElement.disabled = true;

        const payload = {
            fichaId: parseInt(fichaId),
            turmaId: parseInt(turmaId),
            data: dataIso
        };

        fetchApi('/api/agendamentos/desalocar', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error || 'Erro ao desalocar'); });
                }
                return res.json();
            })
            .then(() => recarregarDiaAtual())
            .catch(err => {
                alert(err.message);
                btnElement.disabled = false;
            });
    }

    /**
     * Recarrega os dados da data selecionada
     */
    function recarregarDiaAtual() {
        const celulaAtiva = document.querySelector('.day-cell.active-selected');
        if (celulaAtiva) {
            const dataIso = celulaAtiva.getAttribute('data-date');
            buscarAgendamentos(dataIso, diaSelecionadoGlobal, nomesMeses[dataCalendario.getMonth()], dataCalendario.getFullYear());
        } else {
            renderizarGrid();
        }
    }

    // Controles do Mês
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() - 1);
            renderizarGrid();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            dataCalendario.setMonth(dataCalendario.getMonth() + 1);
            renderizarGrid();
        });
    }

    // Execução Inicial
    inicializarSistema();
});