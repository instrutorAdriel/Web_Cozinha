// ===== VARIÁVEIS GLOBAIS DE ESTADO =====
let agendamentosDoDia = [];
let agendamentosDaSemana = [];
let todasAsFichasDoBanco = [];
let fichaAtual = null;
let detalhesReceitaAtual = null;
let requisicaoDetalhesAtual = 0;
const LIMITE_SCROLL = 10;
const $ = id => document.getElementById(id);

// Aceita os IDs usados nas duas versões do código e no layout do projeto.
function obterSelectTurma() {
    return $('turma-select') || $('select-turma') || $('turma');
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
    atualizarEstadoBotoesChecklist(false);
    carregarDadosIniciais();

    // ========================================================
    // LÓGICA DE ABERTURA E FECHAMENTO DOS MODAIS
    // ========================================================
    const modalExtra = $('extra-modal');
    const modalUtil = $('util-modal');

    const fecharModalInsumo = () => {
        if (modalExtra) modalExtra.classList.remove('show');
    };

    const fecharModalUtil = () => {
        if (modalUtil) modalUtil.classList.remove('show');
    };

    if ($('btn-add-insumo')) {
        $('btn-add-insumo').addEventListener('click', () => {
            if (modalExtra) modalExtra.classList.add('show');
        });
    }

    if ($('extra-close')) $('extra-close').addEventListener('click', fecharModalInsumo);
    if ($('extra-cancel')) $('extra-cancel').addEventListener('click', fecharModalInsumo);

    if ($('btn-add-util')) {
        $('btn-add-util').addEventListener('click', () => {
            if (modalUtil) modalUtil.classList.add('show');
        });
    }

    if ($('util-close')) $('util-close').addEventListener('click', fecharModalUtil);
    if ($('util-cancel')) $('util-cancel').addEventListener('click', fecharModalUtil);


    // ========================================================
    // ENVIO: SOLICITAR INSUMO EXTRA
    // ========================================================
    const btnSaveExtra = $('extra-save');

    if (btnSaveExtra) {
        btnSaveExtra.addEventListener('click', () => {
            const nomeInsumo = $('extra-name') ? $('extra-name').value.trim() : '';
            const quantidade = $('extra-qtd') ? $('extra-qtd').value.trim() : '';
            const unidade = $('extra-un') ? $('extra-un').value : 'un';
            const observacao = $('extra-obs') ? $('extra-obs').value.trim() : '';
            const turmaSelect = obterSelectTurma();
            const idTurma = turmaSelect ? turmaSelect.value : null;

            if (!nomeInsumo || !quantidade) {
                alert("Por favor, preencha o nome do insumo e a quantidade.");
                return;
            }

            if (!idTurma || idTurma === "todas" || idTurma === "") {
                alert("Selecione uma turma específica na barra superior antes de solicitar um insumo extra.");
                return;
            }

            btnSaveExtra.innerText = "Enviando...";
            btnSaveExtra.disabled = true;

            fetch('/api/fichas/solicitar-insumo-extra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomeInsumo: nomeInsumo,
                    quantidade: parseFloat(quantidade),
                    unidadeMedida: unidade,
                    justificativa: observacao,
                    idTurma: parseInt(idTurma)
                })
            })
                .then(async res => {
                    if (!res.ok) throw new Error(await res.text());
                    return res.text();
                })
                .then(msg => {
                    alert("Insumo extra solicitado com sucesso para validação!");
                    $('extra-name').value = '';
                    $('extra-qtd').value = '';
                    $('extra-obs').value = '';
                    fecharModalInsumo();
                })
                .catch(err => alert("Erro: " + err.message))
                .finally(() => {
                    btnSaveExtra.innerText = "Adicionar";
                    btnSaveExtra.disabled = false;
                });
        });
    }


    // ========================================================
    // ENVIO: SOLICITAR UTENSÍLIO EXTRA
    // ========================================================
    const btnSaveUtil = $('util-save');

    if (btnSaveUtil) {
        btnSaveUtil.addEventListener('click', () => {
            const nomeUtensilio = $('util-name') ? $('util-name').value.trim() : '';
            const quantidade = $('util-qtd') ? $('util-qtd').value.trim() : '';
            const observacao = $('util-obs') ? $('util-obs').value.trim() : '';
            const turmaSelect = obterSelectTurma();
            const idTurma = turmaSelect ? turmaSelect.value : null;

            if (!nomeUtensilio || !quantidade) {
                alert("Por favor, preencha o nome do utensílio e a quantidade.");
                return;
            }

            if (!idTurma || idTurma === "todas" || idTurma === "") {
                alert("Selecione uma turma específica na barra superior antes de solicitar um utensílio extra.");
                return;
            }

            btnSaveUtil.innerText = "Enviando...";
            btnSaveUtil.disabled = true;

            fetch('/api/fichas/solicitar-utensilio-extra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomeUtensilio: nomeUtensilio,
                    quantidade: parseInt(quantidade),
                    justificativa: observacao,
                    idTurma: parseInt(idTurma)
                })
            })
                .then(async res => {
                    if (!res.ok) throw new Error(await res.text());
                    return res.text();
                })
                .then(msg => {
                    alert("Utensílio extra solicitado com sucesso para validação!");
                    $('util-name').value = '';
                    $('util-qtd').value = '';
                    $('util-obs').value = '';
                    fecharModalUtil();
                })
                .catch(err => alert("Erro: " + err.message))
                .finally(() => {
                    btnSaveUtil.innerText = "Adicionar Utensílio";
                    btnSaveUtil.disabled = false;
                });
        });
    }
});


// ===== PERÍODO DA SEMANA ATUAL (SEGUNDA A SEXTA) =====
function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Data de hoje (YYYY-MM-DD), recalculada a cada chamada para não ficar
// desatualizada caso a página fique aberta durante a virada do dia.
function obterDataHoje() {
    return formatarDataLocal(new Date());
}

// Retorna true somente se o agendamento pertence ao dia de hoje.
function ehAgendamentoDeHoje(agendamento) {
    const dataAgendamento = String(agendamento?.data ?? '').slice(0, 10);
    return dataAgendamento !== '' && dataAgendamento === obterDataHoje();
}

// ÚNICA fonte de receitas para a checklist: agendamentos ativos E de hoje.
// Filtra pela data a cada chamada, mesmo que /api/agendamentos/hoje
// devolva agendamentos de outros dias.
function obterAgendamentosDeHoje() {
    return agendamentosDoDia.filter(a =>
        a.situacao === 'A' &&
        a.ficha &&
        ehAgendamentoDeHoje(a)
    );
}

// Identifica um agendamento pela receita + dia (a mesma receita pode
// aparecer em dias diferentes da semana).
function chaveAgendamento(agendamento) {
    const ficha = agendamento?.ficha;
    const idFicha = ficha?.idFicha ?? ficha?.id;
    const data = String(agendamento?.data ?? '').slice(0, 10);
    return `${idFicha}|${data}`;
}

// Receitas da semana (segunda a sexta) disponíveis para escolha.
function obterAgendamentosDaSemana() {
    return agendamentosDaSemana.filter(a =>
        a.ficha &&
        (a.situacao == null || a.situacao === 'A')
    );
}

// Rótulo curto do dia da semana de uma data (YYYY-MM-DD), com "Hoje" quando for o caso.
function rotuloDiaSemana(data) {
    const iso = String(data ?? '').slice(0, 10);
    const partes = iso.split('-').map(Number);

    if (partes.length !== 3 || partes.some(Number.isNaN)) return 'Sem data';

    if (iso === obterDataHoje()) return 'Hoje';

    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return dias[new Date(partes[0], partes[1] - 1, partes[2]).getDay()];
}

function obterPeriodoSemana() {
    const hoje = new Date();

    const segunda = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );

    segunda.setDate(
        segunda.getDate() - ((segunda.getDay() + 6) % 7)
    );

    const sexta = new Date(segunda);
    sexta.setDate(sexta.getDate() + 4);

    return {
        segunda,
        inicio: formatarDataLocal(segunda),
        fim: formatarDataLocal(sexta)
    };
}

async function buscarAgendamentosSemana() {
    const { inicio, fim } = obterPeriodoSemana();
    const parametros = new URLSearchParams({ inicio, fim });

    const resposta = await fetch(`/api/agendamentos/semana?${parametros}`);

    if (!resposta.ok) {
        throw new Error(
            `Não foi possível carregar os agendamentos da semana (HTTP ${resposta.status}). Verifique o endpoint /api/agendamentos/semana no Spring Boot.`
        );
    }

    return resposta.status === 204 ? [] : resposta.json();
}


// ===== 1. BUSCA DE DADOS NA API E FILTROS DINÂMICOS =====
function carregarDadosIniciais() {
    const containerClasses = document.querySelector('.classes-col');

    Promise.all([
        fetch('/api/turmas').then(res => {
            if (!res.ok && res.status !== 204) {
                throw new Error('Erro ao carregar turmas.');
            }

            return res.status === 204 ? [] : res.json();
        }),

        fetch('/api/agendamentos/hoje').then(res => {
            if (!res.ok && res.status !== 204) {
                throw new Error('Erro ao carregar receitas de hoje.');
            }

            return res.status === 204 ? [] : res.json();
        }),

        fetch('/api/fichas').then(res => {
            if (!res.ok && res.status !== 204) {
                throw new Error('Erro ao carregar fichas.');
            }

            return res.status === 204 ? [] : res.json();
        }),

        buscarAgendamentosSemana()
    ])
        .then(([turmas, agendamentos, fichas, semana]) => {
            agendamentosDoDia = agendamentos;
            agendamentosDaSemana = semana;

            const foraDeHoje = agendamentos.filter(
                a => !ehAgendamentoDeHoje(a)
            );

            if (foraDeHoje.length > 0) {
                console.warn(
                    `/api/agendamentos/hoje retornou ${foraDeHoje.length} agendamento(s) que não são de hoje (${obterDataHoje()}); eles foram ignorados.`,
                    foraDeHoje
                );
            }

            todasAsFichasDoBanco = fichas;

            popularTurmasDropdown(turmas);

            const turmaSalva = sessionStorage.getItem("turmaSelecionadaId");

            const turmaValida = turmas.some(
                t => (t.id || t.idTurma).toString() === turmaSalva
            );

            let turmaInicialId = 'todas';

            if (turmaSalva && turmaValida) {
                turmaInicialId = turmaSalva;
            } else if (turmas.length > 0) {
                turmaInicialId = String(
                    turmas[0].idTurma ?? turmas[0].id
                );
            }

            // Define a seleção no <select> e aplica o filtro.
            const turmaSelect = obterSelectTurma();

            if (turmaSelect) {
                turmaSelect.value = turmaInicialId;
            }

            filtrarPorTurma(turmaInicialId);
            atualizarContadorReceitasHoje(turmaInicialId);

            const contadorTurmas = document.getElementById('hero-turmas-count');

            if (contadorTurmas) {
                const turmasUnicasHoje = new Set();

                obterAgendamentosDeHoje().forEach(agendamento => {
                    if (agendamento.ficha?.turma) {
                        const idTurma =
                            agendamento.ficha.turma.idTurma ??
                            agendamento.ficha.turma.id;

                        if (idTurma != null) {
                            turmasUnicasHoje.add(String(idTurma));
                        }
                    }
                });

                const quantidade = turmasUnicasHoje.size;

                contadorTurmas.textContent =
                    `${quantidade} turma${quantidade !== 1 ? 's' : ''}`;
            }

            // Listener do Select do Checklist Manual.
            const selectReceita = $('recipe-select');

            if (selectReceita) {
                selectReceita.removeEventListener(
                    'change',
                    onReceitaChange
                );

                selectReceita.addEventListener(
                    'change',
                    onReceitaChange
                );
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);

            if (containerClasses) {
                containerClasses.innerHTML +=
                    '<p style="color:red; padding:20px;">Erro ao carregar os dados.</p>';
            }

            const selectReceita = $('recipe-select');

            if (selectReceita) {
                selectReceita.innerHTML =
                    '<option value="">Erro ao carregar receitas</option>';
            }
        });
}


function popularTurmasDropdown(turmas) {
    const turmaSelect = obterSelectTurma();

    if (!turmaSelect) return;

    turmaSelect.innerHTML = '';

    if (turmas.length === 0) {
        turmaSelect.innerHTML =
            '<option value="">-- Nenhuma Turma Vinculada --</option>';
    } else {
        turmas.forEach(turma => {
            const id = turma.idTurma || turma.id;
            const nomeTurma =
                turma.nomeTurma || turma.nome || "Turma sem nome";

            let labNome = 'Laboratório N/A';

            if (
                typeof turma.laboratorio === 'object' &&
                turma.laboratorio !== null
            ) {
                labNome =
                    turma.laboratorio.nomeLaboratorio || 'Laboratório N/A';
            } else if (
                typeof turma.laboratorio === 'string' &&
                turma.laboratorio.trim() !== ''
            ) {
                labNome = turma.laboratorio;
            }

            turmaSelect.innerHTML +=
                `<option value="${id}">${nomeTurma} - ${labNome}</option>`;
        });
    }

    turmaSelect.removeEventListener('change', onTurmaChange);
    turmaSelect.addEventListener('change', onTurmaChange);
}


function onTurmaChange(e) {
    const selectedId = e.target.value;

    if (selectedId && selectedId !== "todas") {
        sessionStorage.setItem("turmaSelecionadaId", selectedId);
    } else {
        sessionStorage.removeItem("turmaSelecionadaId");
    }

    filtrarPorTurma(selectedId);
}


function filtrarPorTurma(turmaId) {
    atualizarContadorReceitasHoje(turmaId);

    const containerClasses = document.querySelector('.classes-col');

    if (!containerClasses) return;

    let lista = $('receitas-semana-lista');

    if (!lista) {
        lista = document.createElement('div');
        lista.id = 'receitas-semana-lista';
        lista.className = 'receitas-semana-lista';
        containerClasses.appendChild(lista);
    }

    // Filtra os agendamentos pela turma selecionada.
    const pertenceATurma = agendamento => {
        if (turmaId === 'todas' || turmaId === '') {
            return true;
        }

        const idTurma =
            agendamento.ficha?.turma?.idTurma ??
            agendamento.ficha?.turma?.id;

        return String(idTurma) === String(turmaId);
    };

    // Atualiza os cards da semana.
    const agendamentosFiltrados =
        agendamentosDaSemana.filter(pertenceATurma);

    renderizarSemana(agendamentosFiltrados, lista);

    const selectReceita = $('recipe-select');

    // Receita de hoje para a turma selecionada.
    const receitaHoje =
        obterAgendamentosDeHoje().find(pertenceATurma);

    // Opções: receitas de hoje + receitas da semana,
    // sem repetir a mesma receita no mesmo dia e em ordem de data.
    const opcoesAgendamentos = [
        ...obterAgendamentosDeHoje().filter(pertenceATurma),
        ...obterAgendamentosDaSemana().filter(pertenceATurma)
    ].sort((a, b) =>
        String(a.data ?? '').localeCompare(String(b.data ?? ''))
    );

    if (selectReceita) {
        selectReceita.innerHTML = '';

        // Sem receita hoje: mostra o aviso, mas ainda permite escolher as da semana.
        if (!receitaHoje) {
            const opcaoVazia = document.createElement('option');

            opcaoVazia.value = '';
            opcaoVazia.textContent = opcoesAgendamentos.length > 0
                ? 'Nenhuma receita disponível hoje'
                : 'Nenhuma receita disponível';

            opcaoVazia.disabled = true;
            opcaoVazia.selected = true;

            selectReceita.appendChild(opcaoVazia);
        }

        const chavesAdicionadas = new Set();

        opcoesAgendamentos.forEach(agendamento => {
            const ficha = agendamento.ficha;
            const idFicha = ficha.idFicha ?? ficha.id;

            if (idFicha == null) return;

            const chave = chaveAgendamento(agendamento);

            if (chavesAdicionadas.has(chave)) return;

            chavesAdicionadas.add(chave);

            const nomeFicha =
                ficha.nomeFicha ||
                ficha.nome ||
                'Receita sem nome';

            const nomeTurma = ficha.turma
                ? (
                    ficha.turma.nomeTurma ||
                    ficha.turma.nome ||
                    'Turma sem nome'
                )
                : 'Turma indefinida';

            const opcao = document.createElement('option');

            opcao.value = chave;
            opcao.textContent =
                `${nomeFicha} (${nomeTurma}) - ${rotuloDiaSemana(agendamento.data)}`;

            selectReceita.appendChild(opcao);
        });
    }

    // Limpa os detalhes da receita anterior.
    limparDetalhesDaTela();

    // Seleciona automaticamente a primeira receita de hoje, se existir.
    if (receitaHoje) {
        selecionarAula(
            receitaHoje.ficha.idFicha ?? receitaHoje.ficha.id,
            receitaHoje
        );
    } else {
        mostrarSemReceitaDisponivel();
    }
}


// ===== CARDS EXPANSÍVEIS DOS DIAS DA SEMANA =====
function renderizarSemana(agendamentos, container) {
    if (!container) return;

    container.replaceChildren();

    const dias = [
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira'
    ];

    const { segunda } = obterPeriodoSemana();
    const dataAtual = obterDataHoje();

    dias.forEach((nomeDia, indice) => {
        const data = new Date(segunda);
        data.setDate(segunda.getDate() + indice);

        const dataISO = formatarDataLocal(data);
        const ehHoje = dataISO === dataAtual;

        const receitas = agendamentos.filter(
            a => String(a.data ?? '').slice(0, 10) === dataISO
        );

        // Cria o card do dia.
        const card = document.createElement('div');
        card.className = 'semana-dia-card';

        // Abre automaticamente o card correspondente ao dia atual.
        if (ehHoje) {
            card.classList.add('aberto');
        }

        // Cabeçalho do card.
        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'semana-dia-header';
        header.setAttribute('aria-expanded', String(ehHoje));

        const info = document.createElement('div');
        info.className = 'semana-dia-info';

        const titulo = document.createElement('h3');

        titulo.textContent = ehHoje
            ? `${nomeDia} (Hoje)`
            : nomeDia;

        info.appendChild(titulo);

        const seta = document.createElement('span');
        seta.className = 'material-symbols-outlined semana-dia-seta';
        seta.textContent = 'expand_more';

        header.append(info, seta);

        // Conteúdo do card.
        const conteudo = document.createElement('div');
        conteudo.className = 'semana-dia-conteudo';

        if (receitas.length > 0) {
            renderizarCardsDeAulas(receitas, conteudo);
        } else {
            const aviso = document.createElement('p');
            aviso.className = 'semana-dia-vazio';
            aviso.textContent =
                'Nenhuma receita programada para este dia.';

            conteudo.appendChild(aviso);
        }

        // Qualquer dia pode ser aberto ou fechado para consulta.
        header.addEventListener('click', () => {
            const aberto = card.classList.toggle('aberto');

            header.setAttribute(
                'aria-expanded',
                String(aberto)
            );
        });

        card.append(header, conteudo);
        container.appendChild(card);
    });
}


// Aviso exibido quando não há nenhuma receita agendada para hoje.
function mostrarSemReceitaDisponivel() {
    const aviso = '<p style="padding:12px; color:#64748b; text-align:center;">Nenhuma receita disponível hoje.</p>';

    if ($('summary-recipe-name')) {
        $('summary-recipe-name').textContent = 'Nenhuma receita disponível';
    }

    if ($('summary-steps')) {
        $('summary-steps').innerHTML =
            '<li style="list-style: none;">Nenhuma receita disponível hoje.</li>';
    }

    if ($('checklist-main')) $('checklist-main').innerHTML = aviso;
    if ($('util-checklist')) $('util-checklist').innerHTML = aviso;
}


function limparDetalhesDaTela() {
    requisicaoDetalhesAtual++;

    fichaAtual = null;
    detalhesReceitaAtual = null;

    if ($('summary-recipe-name')) {
        $('summary-recipe-name').textContent = 'Selecione uma aula';
    }

    if ($('summary-steps')) {
        $('summary-steps').innerHTML =
            '<li style="list-style: none;">Nenhuma receita selecionada.</li>';
    }

    if ($('checklist-main')) $('checklist-main').innerHTML = '';
    if ($('util-checklist')) $('util-checklist').innerHTML = '';
    if ($('recipe-name')) $('recipe-name').textContent = '';
    if ($('turma-badge')) $('turma-badge').textContent = '';
    if ($('util-recipe-name')) $('util-recipe-name').textContent = '';
    if ($('util-turma-badge')) $('util-turma-badge').textContent = '';

    atualizarProgresso(
        $('checklist-main'),
        $('main-progress-text'),
        $('main-progress-pct'),
        $('main-progress-bar')
    );

    atualizarProgresso(
        $('util-checklist'),
        $('util-progress-text'),
        $('util-progress-pct'),
        $('util-progress-bar')
    );

    atualizarEstadoBotoesChecklist(false);
}


// Habilita ações somente depois que uma receita válida foi carregada.
function atualizarEstadoBotoesChecklist(habilitado) {
    [
        'btn-finish-insumos',
        'btn-finish-utensilios',
        'btn-add-insumo',
        'btn-add-util',
        'btn-devolucao-utensilios'
    ].forEach(id => {
        const botao = $(id);

        if (botao) {
            botao.disabled = !habilitado;
        }
    });
}


// ===== 2. RENDERIZAÇÃO DOS CARDS =====
function renderizarCardsDeAulas(agendamentos, container) {
    agendamentos.forEach(agendamento => {
        const ficha = agendamento.ficha;

        if (!ficha) return;

        const turma = ficha.turma;

        let lab = 'Laboratório N/A';

        if (turma && turma.laboratorio) {
            lab = typeof turma.laboratorio === 'object'
                ? (turma.laboratorio.nomeLaboratorio || 'Laboratório N/A')
                : turma.laboratorio;
        }

        const nomeTurma = turma
            ? (turma.nomeTurma || turma.nome)
            : 'Turma Indefinida';

        const idFicha = ficha.id || ficha.idFicha;
        const nomeFicha = ficha.nomeFicha || ficha.nome;

        const statusClass =
            agendamento.concluido === 'S' ? 'done' : '';

        const card = document.createElement('div');

        card.className = `class-card ${statusClass}`;
        card.setAttribute('data-recipe', idFicha);
        card.dataset.chave = chaveAgendamento(agendamento);

        card.innerHTML = `
            <div class="class-info">
                <p class="class-name">${nomeFicha}</p>
                <p class="class-meta">${lab} - ${nomeTurma}</p>
            </div>
        `;

        // Qualquer receita da semana pode ser aberta na checklist.
        card.addEventListener('click', () => {
            selecionarAula(idFicha, agendamento);
        });

        container.appendChild(card);
    });
}


// ===== 3. SELEÇÃO DE AULA E DETALHES =====
function selecionarAula(fichaId, agendamentoSelecionado = null) {
    // Sem agendamento informado, prefere o de hoje e depois qualquer outro da semana.
    const mesmaFicha = a =>
        String(a.ficha.id ?? a.ficha.idFicha) === String(fichaId);

    const agendamento = agendamentoSelecionado ||
        obterAgendamentosDeHoje().find(mesmaFicha) ||
        obterAgendamentosDaSemana().find(mesmaFicha);

    if (!agendamento || !agendamento.ficha) {
        return;
    }

    const chave = chaveAgendamento(agendamento);

    const selectReceita = $('recipe-select');

    if (selectReceita) {
        selectReceita.value = chave;
    }

    // Destaca o card exato (receita + dia) que está na checklist.
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.toggle(
            'selected',
            card.dataset.chave === chave
        );
    });

    fichaAtual = agendamento.ficha;

    const requisicaoAtual = ++requisicaoDetalhesAtual;

    fetch(`/api/fichas/${fichaId}/detalhes`)
        .then(async res => {
            if (!res.ok) {
                const corpo = await res.text().catch(() => '');

                throw new Error(
                    `Não foi possível carregar os detalhes da receita ${fichaId} (HTTP ${res.status}). ${corpo.slice(0, 300)}`
                );
            }

            return res.json();
        })
        .then(detalhes => {
            // Descarta respostas antigas quando o usuário troca rapidamente de receita.
            if (requisicaoAtual !== requisicaoDetalhesAtual) {
                return;
            }

            // Verifica se a receita selecionada ainda é a mesma.
            if (
                !fichaAtual ||
                chaveAgendamento({
                    ficha: fichaAtual,
                    data: agendamento.data
                }) !== chave
            ) {
                return;
            }

            detalhesReceitaAtual = detalhes;

            atualizarResumoReceita(fichaAtual);

            renderChecklistInsumos(
                detalhes.insumos,
                fichaAtual,
                detalhes.insumosSeparados
            );

            renderChecklistUtensilios(
                detalhes.utensilios,
                fichaAtual
            );

            atualizarEstadoBotoesChecklist(true);
        })
        .catch(err => {
            if (requisicaoAtual !== requisicaoDetalhesAtual) {
                return;
            }

            console.error('Erro ao carregar detalhes:', err);

            // Só avisa se a receita com erro ainda for a escolhida.
            if (fichaAtual === agendamento.ficha) {
                const aviso = '<p style="padding:12px; color:#b91c1c; text-align:center;">Não foi possível carregar os detalhes desta receita.</p>';

                if ($('checklist-main')) {
                    $('checklist-main').innerHTML = aviso;
                }

                if ($('util-checklist')) {
                    $('util-checklist').innerHTML = aviso;
                }
            }
        });
}


function carregarDetalhesNoChecklistManual(fichaReal) {
    const idFicha = fichaReal.id || fichaReal.idFicha;
    const requisicaoAtual = ++requisicaoDetalhesAtual;

    fetch(`/api/fichas/${idFicha}/detalhes`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro ao carregar detalhes (HTTP ${res.status})`);
            }

            return res.json();
        })
        .then(detalhes => {
            if (requisicaoAtual !== requisicaoDetalhesAtual) {
                return;
            }

            detalhesReceitaAtual = detalhes;
            fichaAtual = fichaReal;

            atualizarResumoReceita(fichaReal);

            renderChecklistInsumos(
                detalhes.insumos,
                fichaReal,
                detalhes.insumosSeparados
            );

            renderChecklistUtensilios(
                detalhes.utensilios,
                fichaReal
            );

            atualizarEstadoBotoesChecklist(true);
        })
        .catch(err => {
            if (requisicaoAtual !== requisicaoDetalhesAtual) {
                return;
            }

            console.error("Erro ao carregar detalhes:", err);
        });
}


function atualizarResumoReceita(ficha) {
    const summaryName = $('summary-recipe-name');
    const summarySteps = $('summary-steps');

    if (summaryName) {
        summaryName.textContent = ficha.nomeFicha || ficha.nome;
    }

    if (summarySteps) {
        if (ficha.preparo) {
            const passos = ficha.preparo
                .split('\n')
                .filter(p => p.trim() !== '');

            summarySteps.innerHTML =
                passos.map(passo => `<li>${passo}</li>`).join('');
        } else {
            summarySteps.innerHTML =
                `<li style="list-style: none;">Modo de preparo indisponível.</li>`;
        }
    }
}


// ===== 4. RENDERIZAÇÃO DOS CHECKLISTS =====
function renderChecklistInsumos(insumos, ficha, separados = []) {
    const lista = $('checklist-main');
    const nome = $('recipe-name');
    const badge = $('turma-badge');

    if (nome) {
        nome.textContent = ficha.nomeFicha || ficha.nome;
    }

    if (badge) {
        badge.textContent = ficha.turma
            ? (ficha.turma.nomeTurma || ficha.turma.nome)
            : '';
    }

    if (!lista) return;

    lista.innerHTML = insumos.map(insumo => {
        const produto = insumo.produto;
        const qtdNecessaria = insumo.quantidade;

        const qtdEstoque =
            produto && produto.quantidade
                ? parseFloat(produto.quantidade)
                : 0;

        const isSeparado = separados.includes(insumo.id);

        let st = 'ok';
        let label = 'OK';

        if (qtdEstoque === 0) {
            st = 'falta';
            label = 'Falta';
        } else if (qtdEstoque < qtdNecessaria) {
            st = 'baixo';
            label = `Falta ${(qtdNecessaria - qtdEstoque)}${produto ? produto.unidade : ''}`;
        }

        const clsEstoque =
            st === 'ok'
                ? ''
                : (st === 'falta' ? 'estoque-falta' : 'estoque-baixo');

        const nomeProduto =
            produto?.nome ||
            produto?.nomeProduto ||
            'Produto não identificado';

        const uni = produto?.unidade || '';

        if (isSeparado) {
            return `
          <label class="check-item" style="pointer-events: none; opacity: 0.5; background-color: #f8fafc;">
            <input type="checkbox" data-id="${insumo.id}" checked disabled>
            <span class="check-box" style="background: #10b981; border-color: #10b981;"><span class="material-symbols-outlined" style="opacity: 1;">check</span></span>
            <span class="check-label" style="text-decoration: line-through;">${nomeProduto}</span>
            <span class="estoque-tag" style="background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;">Separado</span>
            <span class="check-qty">${qtdEstoque}/${qtdNecessaria}${uni}</span>
          </label>`;
        }

        const tagEstoque =
            st === 'ok'
                ? ''
                : `<span class="estoque-tag ${st}">${label}</span>`;

        return `
          <label class="check-item ${clsEstoque}">
            <input type="checkbox" data-id="${insumo.id}">
            <span class="check-box"><span class="material-symbols-outlined">check</span></span>
            <span class="check-label">${nomeProduto}</span>
            ${tagEstoque}
            <span class="check-qty">${qtdEstoque}/${qtdNecessaria}${uni}</span>
          </label>`;
    }).join('');

    aplicarScrollAdaptativo(lista, insumos.length);

    atualizarProgresso(
        lista,
        $('main-progress-text'),
        $('main-progress-pct'),
        $('main-progress-bar')
    );
}


function renderChecklistUtensilios(checklists, ficha) {
    const lista = $('util-checklist');
    const nome = $('util-recipe-name');
    const badge = $('util-turma-badge');

    if (nome) {
        nome.textContent = ficha.nomeFicha || ficha.nome;
    }

    if (badge) {
        badge.textContent = ficha.turma
            ? (ficha.turma.nomeTurma || ficha.turma.nome)
            : '';
    }

    if (!lista) return;

    lista.innerHTML = checklists.map(check => {
        const util = check.utensilio;

        const nomeUtil =
            util?.nome ||
            util?.nomeUtensilio ||
            'Utensílio não identificado';

        const qtd = util?.quantidade || 0;

        const estado = check.estadoAtual || 'PRONTO';
        const isInapto = estado !== 'PRONTO';

        const classeInapto = isInapto ? 'text-muted' : '';

        const labelInapto = isInapto
            ? ` <strong style="color:red; font-size:10px;">(${estado})</strong>`
            : '';

        const taEmUso =
            check.dataHoraSaida != null &&
            check.dataHoraEntrada == null;

        const tagEmUso = taEmUso
            ? `<span class="estoque-tag" style="background-color: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;">Em Uso</span>`
            : '';

        return `
          <label class="check-item ${classeInapto}">
            <input type="checkbox" data-id="${check.id}" data-estado="${estado}" data-em-uso="${taEmUso}">
            <span class="check-box"><span class="material-symbols-outlined">check</span></span>
            <span class="check-label">${nomeUtil}${labelInapto}</span>
            ${tagEmUso}
            <span class="check-qty">${qtd} un</span>
          </label>`;
    }).join('');

    aplicarScrollAdaptativo(lista, checklists.length);

    atualizarProgresso(
        lista,
        $('util-progress-text'),
        $('util-progress-pct'),
        $('util-progress-bar')
    );
}


function atualizarProgresso(lista, elText, elPct, elBar) {
    if (!lista) return;

    const update = () => {
        const checkboxes =
            lista.querySelectorAll('input[type="checkbox"]');

        const total = checkboxes.length;

        const done =
            lista.querySelectorAll('input[type="checkbox"]:checked').length;

        const pct = total
            ? Math.round((done / total) * 100)
            : 0;

        if (elText) {
            elText.textContent = `${done} de ${total} itens marcados`;
        }

        if (elPct) elPct.textContent = pct;

        if (elBar) elBar.style.width = pct + '%';
    };

    lista.removeEventListener('change', update);
    lista.addEventListener('change', update);

    update();
}


function aplicarScrollAdaptativo(container, qtd) {
    if (!container) return;

    const ativar = qtd > LIMITE_SCROLL;

    container.classList.toggle('is-scrollable', ativar);
}


// ===== 5. RESET DA CHECKLIST =====
if ($('main-btn-reset')) {
    $('main-btn-reset').addEventListener('click', () => {
        if ($('checklist-main')) {
            $('checklist-main')
                .querySelectorAll('input[type="checkbox"]')
                .forEach(cb => cb.checked = false);

            $('checklist-main').dispatchEvent(new Event('change'));
        }
    });
}


// ===== 6. LÓGICA DE AÇÕES DE ESTOQUE E UTENSÍLIOS =====
const btnFinishInsumos = $('btn-finish-insumos');

if (btnFinishInsumos) {
    btnFinishInsumos.addEventListener('click', () => {
        const marcados = document.querySelectorAll(
            '#checklist-main input[type="checkbox"]:checked:not(:disabled)'
        );

        if (marcados.length === 0) {
            alert("Selecione pelo menos um insumo NOVO para confirmar a separação.");
            return;
        }

        if (!confirm("Deseja confirmar a separação? As quantidades serão deduzidas do estoque.")) {
            return;
        }

        const insumoIds = Array.from(marcados)
            .map(cb => parseInt(cb.dataset.id));

        btnFinishInsumos.innerText = "Processando...";
        btnFinishInsumos.disabled = true;

        fetch('/api/fichas/confirmar-separacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                insumosMarcados: insumoIds,
                observacao: "Separação de Aula confirmada via Painel."
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const erroBackend = await res.text();

                    throw new Error(
                        erroBackend || "Erro ao atualizar o estoque"
                    );
                }

                return res.text();
            })
            .then(msg => {
                alert("Separação confirmada! O estoque foi deduzido com sucesso.");

                if (fichaAtual) {
                    const idFicha = fichaAtual.id || fichaAtual.idFicha;

                    fetch(`/api/fichas/${idFicha}/detalhes`)
                        .then(res => res.json())
                        .then(detalhes => {
                            detalhesReceitaAtual = detalhes;

                            renderChecklistInsumos(
                                detalhes.insumos,
                                fichaAtual,
                                detalhes.insumosSeparados
                            );
                        });
                }
            })
            .catch(err => {
                console.error(err);

                alert(
                    err.message ||
                    "Ocorreu um erro ao confirmar a separação no banco de dados."
                );
            })
            .finally(() => {
                btnFinishInsumos.innerText = "Confirmar Separação";
                btnFinishInsumos.disabled = false;
            });
    });
}


const btnFinishUtensilios = $('btn-finish-utensilios');

if (btnFinishUtensilios) {
    btnFinishUtensilios.addEventListener('click', () => {
        const marcados = document.querySelectorAll(
            '#util-checklist input[type="checkbox"]:checked'
        );

        if (marcados.length === 0) {
            alert("Selecione pelo menos um utensílio para registrar a saída.");
            return;
        }

        const temItemInapto = Array.from(marcados)
            .some(cb => cb.dataset.estado !== 'PRONTO');

        if (temItemInapto) {
            alert(
                "Atenção: Você selecionou utensílios que estão DANIFICADOS ou EM MANUTENÇÃO.\n\nSe eles já foram consertados, selecione-os e clique em 'Registrar Devolução' para atualizar o estado para 'PRONTO' antes de confirmar a saída."
            );

            return;
        }

        const temEmUso = Array.from(marcados)
            .some(cb => cb.dataset.emUso === 'true');

        if (temEmUso) {
            alert(
                "Atenção: Você selecionou utensílios que já estão EM USO.\n\nEles não podem ser retirados 2 vezes. Desmarque-os para retirar novos itens ou utilize o botão 'Registrar Devolução'."
            );

            return;
        }

        if (!confirm("Confirmar a retirada destes utensílios para a aula? A hora de saída será registrada.")) {
            return;
        }

        const checklistIds = Array.from(marcados)
            .map(cb => parseInt(cb.dataset.id));

        btnFinishUtensilios.innerText = "Processando...";
        btnFinishUtensilios.disabled = true;

        fetch('/api/fichas/confirmar-utensilios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                checklistIds: checklistIds
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const erroBackend = await res.text();

                    throw new Error(
                        erroBackend || "Erro ao confirmar utensílios"
                    );
                }

                return res.text();
            })
            .then(msg => {
                alert("Retirada de utensílios registrada com sucesso!");

                document.querySelectorAll(
                    '#util-checklist input[type="checkbox"]'
                ).forEach(cb => cb.checked = false);

                if ($('util-checklist')) {
                    $('util-checklist').dispatchEvent(new Event('change'));
                }

                if (fichaAtual) {
                    const idFicha = fichaAtual.id || fichaAtual.idFicha;

                    fetch(`/api/fichas/${idFicha}/detalhes`)
                        .then(res => res.json())
                        .then(detalhes => {
                            detalhesReceitaAtual = detalhes;

                            renderChecklistUtensilios(
                                detalhes.utensilios,
                                fichaAtual
                            );
                        });
                }
            })
            .catch(err => {
                console.error(err);

                alert(
                    err.message ||
                    "Ocorreu um erro ao confirmar a retirada no banco de dados."
                );
            })
            .finally(() => {
                btnFinishUtensilios.innerText = "Confirmar Utensílios";
                btnFinishUtensilios.disabled = false;
            });
    });
}


// ===== 6.1 DEVOLUÇÃO DE UTENSÍLIOS =====
const devolucaoModal = $('devolucao-modal');
const btnDevolucao = $('btn-devolucao-utensilios');

let checklistIdsSelecionadosParaDevolucao = [];

if (btnDevolucao && devolucaoModal) {
    btnDevolucao.addEventListener('click', () => {
        const marcados = document.querySelectorAll(
            '#util-checklist input[type="checkbox"]:checked'
        );

        if (marcados.length === 0) {
            alert("Selecione pelo menos um utensílio na lista para registrar a devolução.");
            return;
        }

        checklistIdsSelecionadosParaDevolucao = Array.from(marcados)
            .map(cb => parseInt(cb.dataset.id));

        let nomesUtensilios = [];

        if (
            detalhesReceitaAtual &&
            detalhesReceitaAtual.utensilios
        ) {
            detalhesReceitaAtual.utensilios.forEach(check => {
                if (
                    check.utensilio &&
                    checklistIdsSelecionadosParaDevolucao.includes(check.id)
                ) {
                    nomesUtensilios.push(
                        check.utensilio.nomeUtensilio
                    );
                }
            });
        }

        const inputNome = $('devolucao-nome-util');

        if (inputNome) {
            inputNome.value = nomesUtensilios.join(', ');
        }

        if ($('devolucao-obs')) {
            $('devolucao-obs').value = 'Devolvido.';
        }

        if ($('devolucao-estado')) {
            $('devolucao-estado').value = 'PRONTO';
        }

        devolucaoModal.classList.add('show');
    });
}


function fecharModalDevolucao() {
    if (devolucaoModal) {
        devolucaoModal.classList.remove('show');
    }
}

if ($('devolucao-close')) {
    $('devolucao-close').addEventListener(
        'click',
        fecharModalDevolucao
    );
}

if ($('devolucao-cancel')) {
    $('devolucao-cancel').addEventListener(
        'click',
        fecharModalDevolucao
    );
}


if ($('devolucao-save')) {
    $('devolucao-save').addEventListener('click', () => {
        const estadoAtual = $('devolucao-estado')
            ? $('devolucao-estado').value
            : 'PRONTO';

        const obs = $('devolucao-obs')
            ? $('devolucao-obs').value.trim()
            : '';

        if (checklistIdsSelecionadosParaDevolucao.length === 0) {
            alert("Erro interno: Nenhum utensílio válido foi selecionado para devolução.");
            return;
        }

        const btnSave = $('devolucao-save');

        btnSave.innerText = "Processando...";
        btnSave.disabled = true;

        fetch('/api/fichas/devolver-utensilio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                checklistIds: checklistIdsSelecionadosParaDevolucao,
                estadoAtual: estadoAtual,
                observacao: obs
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Erro ao registrar devolução");
                }

                return res.text();
            })
            .then(msg => {
                alert("Status / Devolução registrada com sucesso no banco de dados!");

                document.querySelectorAll(
                    '#util-checklist input[type="checkbox"]'
                ).forEach(cb => cb.checked = false);

                if ($('util-checklist')) {
                    $('util-checklist').dispatchEvent(new Event('change'));
                }

                fecharModalDevolucao();

                if (fichaAtual) {
                    const idFicha = fichaAtual.id || fichaAtual.idFicha;

                    fetch(`/api/fichas/${idFicha}/detalhes`)
                        .then(res => res.json())
                        .then(detalhes => {
                            detalhesReceitaAtual = detalhes;

                            renderChecklistUtensilios(
                                detalhes.utensilios,
                                fichaAtual
                            );
                        });
                }
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao tentar registrar devolução no banco de dados.");
            })
            .finally(() => {
                btnSave.innerText = "Confirmar Devolução";
                btnSave.disabled = false;
            });
    });
}


// ===== 7. MENU E MODO COZINHA =====
const menuBtn = $('menu-toggle');
const sidebar = $('sidebar');
const overlay = $('overlay');

function toggleSidebar(open) {
    if (sidebar) sidebar.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('show', open);
}

menuBtn?.addEventListener('click', () => {
    toggleSidebar(!sidebar?.classList.contains('open'));
});

overlay?.addEventListener('click', () => {
    toggleSidebar(false);
});


const btnOpenKitchen = $('btn-open-kitchen');
const kitchenModal = $('kitchen-modal');
const kitchenTitle = $('kitchen-title');
const kitchenSteps = $('kitchen-steps');

if (btnOpenKitchen) {
    btnOpenKitchen.addEventListener('click', () => {
        if (!fichaAtual) return;

        if (kitchenTitle) {
            kitchenTitle.textContent =
                fichaAtual.nomeFicha || fichaAtual.nome;
        }

        if (kitchenSteps) {
            if (fichaAtual.preparo) {
                renderizarPassosReceita(
                    fichaAtual.preparo,
                    "kitchen-steps"
                );
            } else {
                kitchenSteps.innerHTML =
                    `<li>Modo de preparo indisponível.</li>`;
            }
        }

        if (kitchenModal) {
            kitchenModal.classList.add('show');
        }
    });
}


const kitchenClose = $('kitchen-close');

if (kitchenClose) {
    kitchenClose.addEventListener('click', () => {
        if (kitchenModal) {
            kitchenModal.classList.remove('show');
        }
    });
}


// ===== 8. CONTADOR DE RECEITAS DE HOJE =====
function atualizarContadorReceitasHoje(turmaId) {
    const contador = document.getElementById('hero-receitas-count');

    if (!contador) return;

    let receitasHoje = obterAgendamentosDeHoje();

    if (turmaId && turmaId !== 'todas') {
        receitasHoje = receitasHoje.filter(agendamento => {
            const idTurma =
                agendamento.ficha?.turma?.idTurma ??
                agendamento.ficha?.turma?.id;

            return String(idTurma) === String(turmaId);
        });
    }

    const quantidade = receitasHoje.length;

    contador.textContent =
        `${quantidade} ${quantidade === 1 ? 'receita' : 'receitas'}`;
}


// ===== 9. MODO DE PREPARO =====
function separarPassosReceita(preparo) {
    if (!preparo || typeof preparo !== "string") {
        return [];
    }

    return preparo
        .split(".")
        .map(passo => passo.trim())
        .filter(passo => passo.length > 0)
        .map(passo => passo + ".");
}


function renderizarPassosReceita(preparo, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const passos = separarPassosReceita(preparo);

    passos.forEach(passo => {
        const li = document.createElement("li");

        li.textContent = passo;

        container.appendChild(li);
    });
}


// ===== 10. SELEÇÃO MANUAL DE RECEITA =====
function onReceitaChange(event) {
    const chaveSelecionada = event.target.value;

    if (!chaveSelecionada) {
        limparDetalhesDaTela();
        return;
    }

    // Procura a receita (e o dia) escolhida entre hoje e a semana.
    const agendamento = [
        ...obterAgendamentosDeHoje(),
        ...obterAgendamentosDaSemana()
    ].find(item =>
        chaveAgendamento(item) === chaveSelecionada
    );

    if (agendamento) {
        const idFicha =
            agendamento.ficha.idFicha ??
            agendamento.ficha.id;

        selecionarAula(idFicha, agendamento);

        return;
    }

    console.warn(
        'Não foi encontrado agendamento para a receita selecionada.'
    );

    limparDetalhesDaTela();
}