// ===== VARIÁVEIS GLOBAIS DE ESTADO =====
let agendamentosDoDia = [];
let agendamentosDaSemana = [];
let todasAsFichasDoBanco = [];
let fichaAtual = null;
let detalhesReceitaAtual = null;
const LIMITE_SCROLL = 10;
const $ = id => document.getElementById(id);

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosIniciais();
});

// ===== PERÍODO DA SEMANA ATUAL (SEGUNDA A SEXTA) =====
function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function obterPeriodoSemana() {
    const hoje = new Date();
    const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    segunda.setDate(segunda.getDate() - ((segunda.getDay() + 6) % 7));
    const sexta = new Date(segunda);
    sexta.setDate(sexta.getDate() + 4);
    return {segunda, inicio: formatarDataLocal(segunda), fim: formatarDataLocal(sexta)};
}

async function buscarAgendamentosSemana() {
    const {inicio, fim} = obterPeriodoSemana();
    const parametros = new URLSearchParams({inicio, fim});
    const resposta = await fetch(`/api/agendamentos/semana?${parametros}`);
    if (!resposta.ok) throw new Error(`Não foi possível carregar os agendamentos da semana (HTTP ${resposta.status}). Verifique o endpoint /api/agendamentos/semana no Spring Boot.`);
    return resposta.status === 204 ? [] : resposta.json();
}

// ===== 1. BUSCA DE DADOS NA API E FILTROS DINÂMICOS =====
function carregarDadosIniciais() {
    const containerClasses = document.querySelector('.classes-col');

    Promise.all([
        fetch('/api/turmas').then(res => res.status === 204 ? [] : res.json()),
        fetch('/api/agendamentos/hoje').then(res => res.status === 204 ? [] : res.json()),
        fetch('/api/fichas').then(res => res.json()),
        buscarAgendamentosSemana()
    ])
        .then(([turmas, agendamentos, fichas, semana]) => {
            agendamentosDoDia = agendamentos;
            agendamentosDaSemana = semana;
            todasAsFichasDoBanco = fichas;

            popularTurmasDropdown(turmas);

            // 1. Tenta recuperar a turma salva na sessão
            const turmaSalva = sessionStorage.getItem("turmaSelecionadaId");
            const turmaValida = turmas.some(t => (t.id || t.idTurma).toString() === turmaSalva);

            let turmaInicialId = "todas";
            if (turmaSalva && turmaValida) {
                turmaInicialId = turmaSalva;
            } else if (turmas.length > 0) {
                turmaInicialId = (turmas[0].id || turmas[0].idTurma).toString();
            }

            // Define a seleção no <select> e aplica o filtro
            const turmaSelect = $('turma-select');
            if (turmaSelect) turmaSelect.value = turmaInicialId;

            filtrarPorTurma(turmaInicialId);
            atualizarContadorReceitasHoje(turmaInicialId);

            // === CONTADOR DE TURMAS DE HOJE ===
            const contadorTurmas = document.getElementById('hero-turmas-count');
            if (contadorTurmas) {
                const turmasUnicasHoje = new Set();
                agendamentos.forEach(a => {
                    if (a.ficha && a.ficha.turma) {
                        const idT = a.ficha.turma.id || a.ficha.turma.idTurma;
                        if (idT) turmasUnicasHoje.add(idT);
                    }
                });
                const qtdHoje = turmasUnicasHoje.size;
                contadorTurmas.textContent = `${qtdHoje} turma${qtdHoje !== 1 ? 's' : ''}`;
            }

            // Listener do Select do Checklist Manual
            const selectReceita = $('recipe-select');
            if (selectReceita) {
                selectReceita.addEventListener('change', (e) => {
                    const fichaIdSelecionada = parseInt(e.target.value);
                    if (fichaIdSelecionada) {
                        const fichaReal = todasAsFichasDoBanco.find(f => (f.id || f.idFicha) === fichaIdSelecionada);
                        if (fichaReal) carregarDetalhesNoChecklistManual(fichaReal);
                    }
                });
            }
        })
        .catch(error => {
            console.error("Erro na API:", error);
            if (containerClasses) {
                containerClasses.innerHTML += '<p style="color:red; padding:20px;">Erro ao carregar os dados.</p>';
            }
        });
}

function popularTurmasDropdown(turmas) {
    const turmaSelect = $('turma-select');
    if (!turmaSelect) return;

    turmaSelect.innerHTML = '';

    if (turmas.length === 0) {
        turmaSelect.innerHTML = '<option value="">-- Nenhuma Turma Vinculada --</option>';
    } else {
        turmas.forEach(turma => {
            const id = turma.idTurma || turma.id;
            const nomeTurma = turma.nomeTurma || turma.nome || "Turma sem nome";

            let labNome = 'Laboratório N/A';
            if (typeof turma.laboratorio === 'object' && turma.laboratorio !== null) {
                labNome = turma.laboratorio.nomeLaboratorio || 'Laboratório N/A';
            } else if (typeof turma.laboratorio === 'string' && turma.laboratorio.trim() !== '') {
                labNome = turma.laboratorio;
            }

            turmaSelect.innerHTML += `<option value="${id}">${nomeTurma} - ${labNome}</option>`;
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

    // Preserva o título e usa um contêiner próprio para os cinco dias.
    let lista = $('receitas-semana-lista');
    if (!lista) {
        lista = document.createElement('div');
        lista.id = 'receitas-semana-lista';
        lista.className = 'receitas-semana-lista';
        containerClasses.appendChild(lista);
    }

    const filtrar = a => {
        if (turmaId === 'todas' || turmaId === '') return true;
        const idTurma = a.ficha?.turma?.idTurma ?? a.ficha?.turma?.id;
        return String(idTurma) === String(turmaId);
    };

    const agendamentosFiltrados = agendamentosDaSemana.filter(filtrar);
    renderizarSemana(agendamentosFiltrados, lista);

    // Preserva o seletor manual de fichas para os checklists.
    const selectReceita = $('recipe-select');
    if (selectReceita) {
        selectReceita.innerHTML = '';
        const fichasFiltradas = todasAsFichasDoBanco.filter(f => {
            if (turmaId === 'todas' || turmaId === '') return true;
            const idTurma = f.turma?.idTurma ?? f.turma?.id;
            return String(idTurma) === String(turmaId);
        });
        fichasFiltradas.forEach(f => {
            const nomeTurma = f.turma ? (f.turma.nomeTurma || f.turma.nome) : 'Turma Indefinida';
            const option = document.createElement('option');
            option.value = f.id ?? f.idFicha;
            option.textContent = `${f.nomeFicha || f.nome} (${nomeTurma})`;
            selectReceita.appendChild(option);
        });
    }
    limparDetalhesDaTela();

    // Carrega automaticamente a primeira receita agendada para hoje na turma selecionada.
    const receitaHoje = agendamentosDoDia.find(agendamento =>
        agendamento.situacao === 'A' &&
        agendamento.ficha &&
        filtrar(agendamento)
    );

    if (receitaHoje) {
        const idFicha = receitaHoje.ficha.id ?? receitaHoje.ficha.idFicha;
        if (selectReceita) {
            const opcaoExiste = Array.from(selectReceita.options)
                .some(option => option.value === String(idFicha));
            if (opcaoExiste) selectReceita.value = String(idFicha);
        }
        selecionarAula(idFicha, receitaHoje);
    }
}

// ===== CARDS EXPANSÍVEIS DOS DIAS DA SEMANA =====
function renderizarSemana(agendamentos, container) {
    if (!container) return;
    container.replaceChildren();
    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    const {segunda} = obterPeriodoSemana();

    dias.forEach((nomeDia, indice) => {
        const data = new Date(segunda);
        data.setDate(segunda.getDate() + indice);
        const dataISO = formatarDataLocal(data);
        const receitas = agendamentos.filter(a => String(a.data ?? '').slice(0, 10) === dataISO);

        const card = document.createElement('div');
        card.className = 'semana-dia-card';
        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'semana-dia-header';
        header.setAttribute('aria-expanded', 'false');
        const info = document.createElement('div');
        info.className = 'semana-dia-info';

        const titulo = document.createElement('h3');

        const hoje = new Date();
        const dataAtual = formatarDataLocal(hoje);

        titulo.textContent = dataISO === dataAtual
            ? `${nomeDia} (Hoje)`
            : nomeDia;

        info.appendChild(titulo);

        const seta = document.createElement('span');
        seta.className = 'material-symbols-outlined semana-dia-seta';
        seta.textContent = 'expand_more';
        header.append(info, seta);

        const conteudo = document.createElement('div');
        conteudo.className = 'semana-dia-conteudo';
        if (receitas.length) {
            renderizarCardsDeAulas(receitas, conteudo);
        } else {
            const aviso = document.createElement('p');
            aviso.className = 'semana-dia-vazio';
            aviso.textContent = 'Nenhuma receita programada para este dia.';
            conteudo.appendChild(aviso);
        }
        header.addEventListener('click', () => {
            const aberto = card.classList.toggle('aberto');
            header.setAttribute('aria-expanded', String(aberto));
        });
        card.append(header, conteudo);
        container.appendChild(card);
    });
}

function limparDetalhesDaTela() {
    fichaAtual = null;
    detalhesReceitaAtual = null;
    if ($('summary-recipe-name')) $('summary-recipe-name').textContent = 'Selecione uma aula';
    if ($('summary-steps')) $('summary-steps').innerHTML = '<li style="list-style: none;">Nenhuma receita selecionada.</li>';
    if ($('checklist-main')) $('checklist-main').innerHTML = '';
    if ($('util-checklist')) $('util-checklist').innerHTML = '';
    if ($('recipe-name')) $('recipe-name').textContent = '';
    if ($('turma-badge')) $('turma-badge').textContent = '';
    if ($('util-recipe-name')) $('util-recipe-name').textContent = '';
    if ($('util-turma-badge')) $('util-turma-badge').textContent = '';
    atualizarProgresso($('checklist-main'), $('main-progress-text'), $('main-progress-pct'), $('main-progress-bar'));
    atualizarProgresso($('util-checklist'), $('util-progress-text'), $('util-progress-pct'), $('util-progress-bar'));
}

// ===== 2. RENDERIZAÇÃO DOS CARDS =====
function renderizarCardsDeAulas(agendamentos, container) {
    agendamentos.forEach((agendamento) => {
        const ficha = agendamento.ficha;
        if (!ficha) return;

        const turma = ficha.turma;
        let lab = 'Laboratório N/A';
        if (turma && turma.laboratorio) {
            lab = typeof turma.laboratorio === 'object' ? (turma.laboratorio.nomeLaboratorio || 'Laboratório N/A') : turma.laboratorio;
        }
        const nomeTurma = turma ? (turma.nomeTurma || turma.nome) : 'Turma Indefinida';
        const idFicha = ficha.id || ficha.idFicha;
        const nomeFicha = ficha.nomeFicha || ficha.nome;

        let statusClass = agendamento.concluido === 'S' ? 'done' : '';

        const card = document.createElement('div');
        card.className = `class-card ${statusClass}`;
        card.setAttribute('data-recipe', idFicha);

        card.addEventListener('click', () => selecionarAula(idFicha, agendamento));

        card.innerHTML = `
            <div class="class-info">
                <p class="class-name">${nomeFicha}</p>
                <p class="class-meta">${lab} • ${nomeTurma}</p>
            </div>
        `;
        container.appendChild(card);
    });
}
// ===== 3. SELEÇÃO DE AULA E DETALHES =====
function selecionarAula(fichaId, agendamentoSelecionado = null) {
    const selectReceita = $('recipe-select');
    if (selectReceita) selectReceita.value = String(fichaId);

    document.querySelectorAll('.class-card').forEach(c => {
        c.classList.toggle('selected', Number(c.dataset.recipe) === Number(fichaId));
    });

    const agendamento = agendamentoSelecionado || agendamentosDaSemana.find(a =>
        a.ficha && Number(a.ficha.id ?? a.ficha.idFicha) === Number(fichaId)
    );
    if (!agendamento) return;
    fichaAtual = agendamento.ficha;

    fetch(`/api/fichas/${fichaId}/detalhes`)
        .then(res => res.json())
        .then(detalhes => {
            detalhesReceitaAtual = detalhes;
            atualizarResumoReceita(fichaAtual);
            renderChecklistInsumos(detalhes.insumos, fichaAtual, detalhes.insumosSeparados);
            renderChecklistUtensilios(detalhes.utensilios, fichaAtual);
        })
        .catch(err => console.error("Erro ao carregar detalhes:", err));
}

function carregarDetalhesNoChecklistManual(fichaReal) {
    const idFicha = fichaReal.id || fichaReal.idFicha;
    fetch(`/api/fichas/${idFicha}/detalhes`)
        .then(res => res.json())
        .then(detalhes => {
            detalhesReceitaAtual = detalhes;
            fichaAtual = fichaReal;
            renderChecklistInsumos(detalhes.insumos, fichaReal, detalhes.insumosSeparados);
            renderChecklistUtensilios(detalhes.utensilios, fichaReal);
        })
        .catch(err => console.error("Erro ao carregar detalhes:", err));
}

function atualizarResumoReceita(ficha) {
    const summaryName = $('summary-recipe-name');
    const summarySteps = $('summary-steps');

    if (summaryName) summaryName.textContent = ficha.nomeFicha || ficha.nome;
    if (summarySteps) {
        if (ficha.preparo) {
            const passos = ficha.preparo.split('\n').filter(p => p.trim() !== '');
            summarySteps.innerHTML = passos.map(passo => `<li>${passo}</li>`).join('');
        } else {
            summarySteps.innerHTML = `<li style="list-style: none;">Modo de preparo indisponível.</li>`;
        }
    }
}

// ===== 4. RENDERIZAÇÃO DOS CHECKLISTS =====
function renderChecklistInsumos(insumos, ficha, separados = []) {
    const lista = $('checklist-main');
    const nome = $('recipe-name');
    const badge = $('turma-badge');

    if (nome) nome.textContent = ficha.nomeFicha || ficha.nome;
    if (badge) badge.textContent = ficha.turma ? (ficha.turma.nomeTurma || ficha.turma.nome) : '';
    if (!lista) return;

    lista.innerHTML = insumos.map(insumo => {
        const produto = insumo.produto;
        const qtdNecessaria = insumo.quantidade;
        const qtdEstoque = produto && produto.quantidade ? parseFloat(produto.quantidade) : 0;

        const isSeparado = separados.includes(insumo.id);

        let st = 'ok';
        let label = 'OK';
        if (qtdEstoque === 0) {
            st = 'falta';
            label = 'Falta';
        } else if (qtdEstoque < qtdNecessaria) {
            st = 'baixo';
            label = `Falta ${qtdNecessaria - qtdEstoque}${produto ? produto.unidade : ''}`;
        }

        const clsEstoque = st === 'ok' ? '' : (st === 'falta' ? 'estoque-falta' : 'estoque-baixo');
        const nomeProduto = produto?.nome || produto?.nomeProduto || 'Produto não identificado';
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

        const tagEstoque = st === 'ok' ? '' : `<span class="estoque-tag ${st}">${label}</span>`;

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
    atualizarProgresso(lista, $('main-progress-text'), $('main-progress-pct'), $('main-progress-bar'));
}

function renderChecklistUtensilios(checklists, ficha) {
    const lista = $('util-checklist');
    const nome = $('util-recipe-name');
    const badge = $('util-turma-badge');

    if (nome) nome.textContent = ficha.nomeFicha || ficha.nome;
    if (badge) badge.textContent = ficha.turma ? (ficha.turma.nomeTurma || ficha.turma.nome) : '';
    if (!lista) return;

    lista.innerHTML = checklists.map(check => {
        const util = check.utensilio;
        const nomeUtil = util?.nome || util?.nomeUtensilio || 'Utensílio não identificado';
        const qtd = util?.quantidade || 0;

        const estado = check.estadoAtual || 'PRONTO';
        const isInapto = estado !== 'PRONTO';
        const classeInapto = isInapto ? 'text-muted' : '';
        const labelInapto = isInapto ? ` <strong style="color:red; font-size:10px;">(${estado})</strong>` : '';

        const taEmUso = check.dataHoraSaida != null && check.dataHoraEntrada == null;
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
    atualizarProgresso(lista, $('util-progress-text'), $('util-progress-pct'), $('util-progress-bar'));
}

function atualizarProgresso(lista, elText, elPct, elBar) {
    if (!lista) return;
    const update = () => {
        const checkboxes = lista.querySelectorAll('input[type="checkbox"]');
        const total = checkboxes.length;
        const done = lista.querySelectorAll('input[type="checkbox"]:checked').length;
        const pct = total ? Math.round((done / total) * 100) : 0;

        if (elText) elText.textContent = `${done} de ${total} itens marcados`;
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

if ($('main-btn-reset')) {
    $('main-btn-reset').addEventListener('click', () => {
        if ($('checklist-main')) {
            $('checklist-main').querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            $('checklist-main').dispatchEvent(new Event('change'));
        }
    });
}
// ===== 6. LÓGICA DE AÇÕES DE ESTOQUE E UTENSÍLIOS =====
const btnFinishInsumos = $('btn-finish-insumos');
if (btnFinishInsumos) {
    btnFinishInsumos.addEventListener('click', () => {
        const marcados = document.querySelectorAll('#checklist-main input[type="checkbox"]:checked:not(:disabled)');
        if (marcados.length === 0) {
            alert("Selecione pelo menos um insumo NOVO para confirmar a separação.");
            return;
        }

        if (!confirm("Deseja confirmar a separação? As quantidades serão deduzidas do estoque.")) {
            return;
        }

        const insumoIds = Array.from(marcados).map(cb => parseInt(cb.dataset.id));
        btnFinishInsumos.innerText = "Processando...";
        btnFinishInsumos.disabled = true;

        fetch('/api/fichas/confirmar-separacao', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({insumosMarcados: insumoIds, observacao: "Separação de Aula confirmada via Painel."})
        })
            .then(async res => {
                if (!res.ok) {
                    const erroBackend = await res.text();
                    throw new Error(erroBackend || "Erro ao atualizar o estoque");
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
                            renderChecklistInsumos(detalhes.insumos, fichaAtual, detalhes.insumosSeparados);
                        });
                }
            })
            .catch(err => {
                console.error(err);
                alert(err.message || "Ocorreu um erro ao confirmar a separação no banco de dados.");
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
        const marcados = document.querySelectorAll('#util-checklist input[type="checkbox"]:checked');
        if (marcados.length === 0) {
            alert("Selecione pelo menos um utensílio para registrar a saída.");
            return;
        }

        const temItemInapto = Array.from(marcados).some(cb => cb.dataset.estado !== 'PRONTO');
        if (temItemInapto) {
            alert("Atenção: Você selecionou utensílios que estão DANIFICADOS ou EM MANUTENÇÃO.\n\nSe eles já foram consertados, selecione-os e clique em 'Registrar Devolução' para atualizar o estado para 'PRONTO' antes de confirmar a saída.");
            return;
        }

        const temEmUso = Array.from(marcados).some(cb => cb.dataset.emUso === 'true');
        if (temEmUso) {
            alert("Atenção: Você selecionou utensílios que já estão EM USO.\n\nEles não podem ser retirados 2 vezes. Desmarque-os para retirar novos itens ou utilize o botão 'Registrar Devolução'.");
            return;
        }

        if (!confirm("Confirmar a retirada destes utensílios para a aula? A hora de saída será registrada.")) {
            return;
        }

        const checklistIds = Array.from(marcados).map(cb => parseInt(cb.dataset.id));
        btnFinishUtensilios.innerText = "Processando...";
        btnFinishUtensilios.disabled = true;

        fetch('/api/fichas/confirmar-utensilios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({checklistIds: checklistIds})
        })
            .then(async res => {
                if (!res.ok) {
                    const erroBackend = await res.text();
                    throw new Error(erroBackend || "Erro ao confirmar utensílios");
                }
                return res.text();
            })
            .then(msg => {
                alert("Retirada de utensílios registrada com sucesso!");

                document.querySelectorAll('#util-checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
                if ($('util-checklist')) $('util-checklist').dispatchEvent(new Event('change'));

                if (fichaAtual) {
                    const idFicha = fichaAtual.id || fichaAtual.idFicha;
                    fetch(`/api/fichas/${idFicha}/detalhes`)
                        .then(res => res.json())
                        .then(detalhes => {
                            detalhesReceitaAtual = detalhes;
                            renderChecklistUtensilios(detalhes.utensilios, fichaAtual);
                        });
                }
            })
            .catch(err => {
                console.error(err);
                alert(err.message || "Ocorreu um erro ao confirmar a retirada no banco de dados.");
            })
            .finally(() => {
                btnFinishUtensilios.innerText = "Confirmar Utensílios";
                btnFinishUtensilios.disabled = false;
            });
    });
}

const devolucaoModal = $('devolucao-modal');
const btnDevolucao = $('btn-devolucao-utensilios');
let checklistIdsSelecionadosParaDevolucao = [];

if (btnDevolucao && devolucaoModal) {
    btnDevolucao.addEventListener('click', () => {
        const marcados = document.querySelectorAll('#util-checklist input[type="checkbox"]:checked');

        if (marcados.length === 0) {
            alert("Selecione pelo menos um utensílio na lista para registrar a devolução.");
            return;
        }

        checklistIdsSelecionadosParaDevolucao = Array.from(marcados).map(cb => parseInt(cb.dataset.id));
        let nomesUtensilios = [];

        if (detalhesReceitaAtual && detalhesReceitaAtual.utensilios) {
            detalhesReceitaAtual.utensilios.forEach(check => {
                if (check.utensilio && checklistIdsSelecionadosParaDevolucao.includes(check.id)) {
                    nomesUtensilios.push(check.utensilio.nomeUtensilio);
                }
            });
        }

        const inputNome = $('devolucao-nome-util');
        if (inputNome) inputNome.value = nomesUtensilios.join(', ');

        if ($('devolucao-obs')) $('devolucao-obs').value = 'Devolvido.';
        if ($('devolucao-estado')) $('devolucao-estado').value = 'PRONTO';
        devolucaoModal.classList.add('show');
    });
}

function fecharModalDevolucao() {
    if (devolucaoModal) devolucaoModal.classList.remove('show');
}

if ($('devolucao-close')) $('devolucao-close').addEventListener('click', fecharModalDevolucao);
if ($('devolucao-cancel')) $('devolucao-cancel').addEventListener('click', fecharModalDevolucao);

if ($('devolucao-save')) {
    $('devolucao-save').addEventListener('click', () => {
        const estadoAtual = $('devolucao-estado') ? $('devolucao-estado').value : 'PRONTO';
        const obs = $('devolucao-obs') ? $('devolucao-obs').value.trim() : '';

        if (checklistIdsSelecionadosParaDevolucao.length === 0) {
            alert("Erro interno: Nenhum utensílio válido foi selecionado para devolução.");
            return;
        }

        const btnSave = $('devolucao-save');
        btnSave.innerText = "Processando...";
        btnSave.disabled = true;

        fetch('/api/fichas/devolver-utensilio', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                checklistIds: checklistIdsSelecionadosParaDevolucao,
                estadoAtual: estadoAtual,
                observacao: obs
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao registrar devolução");
                return res.text();
            })
            .then(msg => {
                alert("Status / Devolução registrada com sucesso no banco de dados!");

                document.querySelectorAll('#util-checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
                if ($('util-checklist')) $('util-checklist').dispatchEvent(new Event('change'));

                fecharModalDevolucao();

                if (fichaAtual) {
                    const idFicha = fichaAtual.id || fichaAtual.idFicha;
                    fetch(`/api/fichas/${idFicha}/detalhes`)
                        .then(res => res.json())
                        .then(detalhes => {
                            detalhesReceitaAtual = detalhes;
                            renderChecklistUtensilios(detalhes.utensilios, fichaAtual);
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

menuBtn?.addEventListener('click', () => toggleSidebar(!sidebar?.classList.contains('open')));
overlay?.addEventListener('click', () => toggleSidebar(false));

const btnOpenKitchen = $('btn-open-kitchen');
const kitchenModal = $('kitchen-modal');
const kitchenTitle = $('kitchen-title');
const kitchenSteps = $('kitchen-steps');

if (btnOpenKitchen) {
    btnOpenKitchen.addEventListener('click', () => {
        if (!fichaAtual) return;
        if (kitchenTitle) kitchenTitle.textContent = fichaAtual.nomeFicha || fichaAtual.nome;

        if (kitchenSteps) {
            if (fichaAtual.preparo) {
                const passos = fichaAtual.preparo.split('\n').filter(p => p.trim() !== '');
                kitchenSteps.innerHTML = passos.map(passo => `<li>${passo}</li>`).join('');
            } else {
                kitchenSteps.innerHTML = `<li>Modo de preparo indisponível.</li>`;
            }
        }
        if (kitchenModal) kitchenModal.classList.add('show');
    });
}

const kitchenClose = $('kitchen-close');
if (kitchenClose) kitchenClose.addEventListener('click', () => {
    if (kitchenModal) kitchenModal.classList.remove('show');
});


function atualizarContadorReceitasHoje(turmaId) {
    const contador = document.getElementById('hero-receitas-count');

    if (!contador) return;

    let receitasHoje = agendamentosDoDia.filter(
        agendamento => agendamento.situacao === 'A'
    );

    // Filtra pela turma selecionada na topbar
    if (turmaId && turmaId !== 'todas') {
        receitasHoje = receitasHoje.filter(agendamento => {
            const idTurma = agendamento.ficha?.turma?.id;
            return String(idTurma) === String(turmaId);
        });
    }

    const quantidade = receitasHoje.length;

    contador.textContent =
        `${quantidade} ${quantidade === 1 ? 'receita' : 'receitas'}`;
}

// ===== 8. MODAIS DE SOLICITAÇÃO EXTRA (INSUMOS E UTENSÍLIOS) =====

// --- Lógica do Insumo Extra ---
const btnAddInsumo = $('btn-add-insumo');
const modalExtra = $('extra-modal');
const btnCloseExtra = $('extra-close');
const btnCancelExtra = $('extra-cancel');

if (btnAddInsumo) {
    btnAddInsumo.addEventListener('click', () => {
        if (modalExtra) modalExtra.classList.add('show');
    });
}

const fecharModalInsumo = () => {
    if (modalExtra) modalExtra.classList.remove('show');
};

if (btnCloseExtra) btnCloseExtra.addEventListener('click', fecharModalInsumo);
if (btnCancelExtra) btnCancelExtra.addEventListener('click', fecharModalInsumo);

// --- Lógica do Utensílio Extra ---
const btnAddUtil = $('btn-add-util');
const modalUtil = $('util-modal');
const btnCloseUtil = $('util-close');
const btnCancelUtil = $('util-cancel');

if (btnAddUtil) {
    btnAddUtil.addEventListener('click', () => {
        if (modalUtil) modalUtil.classList.add('show');
    });
}

const fecharModalUtil = () => {
    if (modalUtil) modalUtil.classList.remove('show');
};

if (btnCloseUtil) btnCloseUtil.addEventListener('click', fecharModalUtil);
if (btnCancelUtil) btnCancelUtil.addEventListener('click', fecharModalUtil);