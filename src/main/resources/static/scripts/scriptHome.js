// ===== VARIÁVEIS GLOBAIS DE ESTADO =====
let agendamentosDoDia = [];
let todasAsFichasDoBanco = [];
let fichaAtual = null;
let detalhesReceitaAtual = null;
const LIMITE_SCROLL = 10;
const $ = id => document.getElementById(id);

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  carregarDadosIniciais();
});

// ===== 1. BUSCA DE DADOS NA API E FILTROS DINÂMICOS =====
function carregarDadosIniciais() {
  const containerClasses = document.querySelector('.classes-col');

  // Executa as três buscas simultaneamente
  Promise.all([
    fetch('/api/turmas').then(res => res.status === 204 ? [] : res.json()), // 1. Busca as turmas do usuário
    fetch('/api/agendamentos/hoje').then(res => res.status === 204 ? [] : res.json()), // 2. Busca agendamentos de hoje
    fetch('/api/fichas').then(res => res.json()) // 3. Busca fichas do usuário
  ])
      .then(([turmas, agendamentos, fichas]) => {
        agendamentosDoDia = agendamentos;
        todasAsFichasDoBanco = fichas;

        popularTurmasDropdown(turmas);

        // Define a primeira turma da lista como a seleção padrão (ou "todas" se estiver vazio)
        const primeiraTurmaId = turmas.length > 0 ? turmas[0].id.toString() : "todas";
        filtrarPorTurma(primeiraTurmaId);

        // === ATUALIZA O CONTADOR DE TURMAS DE HOJE ===
        const contadorTurmas = document.getElementById('hero-turmas-count');
        if (contadorTurmas) {
          // Conta turmas únicas que possuem aula no dia de hoje
          const turmasUnicasHoje = new Set();
          agendamentos.forEach(a => {
            if (a.ficha && a.ficha.turma) {
              turmasUnicasHoje.add(a.ficha.turma.id);
            }
          });
          const qtdHoje = turmasUnicasHoje.size;
          contadorTurmas.textContent = `${qtdHoje} turma${qtdHoje !== 1 ? 's' : ''}`;
        }
        // =============================================

        // Listener do Select do Checklist
        const selectReceita = $('recipe-select');
        if (selectReceita) {
          selectReceita.addEventListener('change', (e) => {
            const fichaIdSelecionada = parseInt(e.target.value);
            if (fichaIdSelecionada) {
              const fichaReal = todasAsFichasDoBanco.find(f => f.id === fichaIdSelecionada);
              carregarDetalhesNoChecklistManual(fichaReal);
            }
          });
        }
      })
      .catch(error => {
        console.error("Erro na API:", error);
        containerClasses.innerHTML += '<p style="color:red; padding:20px;">Erro ao carregar os dados.</p>';
      });
}

function popularTurmasDropdown(turmas) {
  const turmaSelect = $('turma-select');
  if (!turmaSelect) return;

  turmaSelect.innerHTML = ''; // Limpa as opções (removendo "Todas as Turmas")

  if (turmas.length === 0) {
    turmaSelect.innerHTML = '<option value="">-- Nenhuma Turma Vinculada --</option>';
  } else {
    turmas.forEach(turma => {
      const labNome = turma.laboratorio ? turma.laboratorio.nomeLaboratorio : 'Laboratório N/A';
      turmaSelect.innerHTML += `<option value="${turma.id}">${turma.nomeTurma} - ${labNome}</option>`;
    });
  }

  // Garante que o evento só seja adicionado uma vez
  turmaSelect.removeEventListener('change', onTurmaChange);
  turmaSelect.addEventListener('change', onTurmaChange);
}

function onTurmaChange(e) {
  filtrarPorTurma(e.target.value);
}

function filtrarPorTurma(turmaId) {
  const containerClasses = document.querySelector('.classes-col');
  const titulos = containerClasses.querySelector('.section-head.split');
  containerClasses.innerHTML = '';
  if (titulos) containerClasses.appendChild(titulos);

  // 1. Filtrar as "Receitas de Hoje" (Agendamentos)
  let agendamentosFiltrados = agendamentosDoDia;
  if (turmaId !== "todas") {
    agendamentosFiltrados = agendamentosDoDia.filter(a => a.ficha && a.ficha.turma && a.ficha.turma.id == parseInt(turmaId));
  }

  if (agendamentosFiltrados.length > 0) {
    renderizarCardsDeAulas(agendamentosFiltrados, containerClasses);
    selecionarAula(agendamentosFiltrados[0].ficha.id);
  } else {
    containerClasses.innerHTML += '<p class="muted" style="padding:20px;">Nenhuma aula programada para esta turma hoje.</p>';
    limparDetalhesDaTela();
  }

  // 2. Filtrar o Select do Checklist
  const selectReceita = $('recipe-select');
  if(selectReceita) {
    selectReceita.innerHTML = '<option value="">-- Selecione uma Receita --</option>';
    let fichasFiltradas = todasAsFichasDoBanco;

    if (turmaId !== "todas") {
      fichasFiltradas = todasAsFichasDoBanco.filter(f => f.turma && f.turma.id == parseInt(turmaId));
    }

    fichasFiltradas.forEach(f => {
      const nomeTurma = f.turma ? f.turma.nomeTurma : "Turma Indefinida";
      selectReceita.innerHTML += `<option value="${f.id}">${f.nomeFicha} (${nomeTurma})</option>`;
    });
  }
}

function limparDetalhesDaTela() {
  fichaAtual = null;
  detalhesReceitaAtual = null;
  $('summary-recipe-name').textContent = 'Selecione uma aula';$('summary-steps').innerHTML = '<li style="list-style: none;">Nenhuma receita selecionada.</li>';
  $('checklist-main').innerHTML = '';$('util-checklist').innerHTML = '';
  $('recipe-name').textContent = '';$('turma-badge').textContent = '';
  $('util-recipe-name').textContent = '';$('util-turma-badge').textContent = '';
  atualizarProgresso($('checklist-main'),$('main-progress-text'), $('main-progress-pct'),$('main-progress-bar'));
  atualizarProgresso($('util-checklist'),$('util-progress-text'), $('util-progress-pct'),$('util-progress-bar'));
}

// ===== 2. RENDERIZAÇÃO DOS CARDS =====
function renderizarCardsDeAulas(agendamentos, container) {
  agendamentos.forEach((agendamento) => {
    const ficha = agendamento.ficha;
    // Prevenção de erro caso a ficha venha nula do banco
    if(!ficha) return;

    const turma = ficha.turma;
    const lab = turma && turma.laboratorio ? turma.laboratorio.nomeLaboratorio : 'Laboratório N/A';
    const nomeTurma = turma ? turma.nomeTurma : 'Turma Indefinida';

    let statusClass = agendamento.concluido === 'S' ? 'done' : '';

    const card = document.createElement('div');
    card.className = `class-card ${statusClass}`;
    card.setAttribute('data-recipe', ficha.id);

    // Adicionado clique diretamente no card inteiro em vez do botão
    card.addEventListener('click', () => selecionarAula(ficha.id));

    // Removido o botão "Ver receita" daqui de baixo
    card.innerHTML = `
            <div class="class-info">
                <p class="class-name">${ficha.nomeFicha}</p>
                <p class="class-meta">${lab} • ${nomeTurma}</p>
            </div>
        `;
    container.appendChild(card);
  });
}

// ===== 3. SELEÇÃO DE AULA E DETALHES =====
function selecionarAula(fichaId) {
  document.querySelectorAll('.class-card').forEach(c => {
    c.classList.toggle('selected', parseInt(c.dataset.recipe) === fichaId);
  });

  const agendamento = agendamentosDoDia.find(a => a.ficha && a.ficha.id === fichaId);
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
  fetch(`/api/fichas/${fichaReal.id}/detalhes`)
      .then(res => res.json())
      .then(detalhes => {
        detalhesReceitaAtual = detalhes;
        fichaAtual = fichaReal;

        // CORREÇÃO: Adicionado o terceiro parâmetro 'detalhes.insumosSeparados'
        renderChecklistInsumos(detalhes.insumos, fichaReal, detalhes.insumosSeparados);

        renderChecklistUtensilios(detalhes.utensilios, fichaReal);
      })
      .catch(err => console.error("Erro ao carregar detalhes:", err));
}

function atualizarResumoReceita(ficha) {
  const summaryName = $('summary-recipe-name');
  const summarySteps = $('summary-steps');

  if (summaryName) summaryName.textContent = ficha.nomeFicha;
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

  if(nome) nome.textContent = ficha.nomeFicha;
  if(badge) badge.textContent = ficha.turma ? ficha.turma.nomeTurma : '';
  if(!lista) return;

  lista.innerHTML = insumos.map(insumo => {
    const produto = insumo.produto;
    const qtdNecessaria = insumo.quantidade;
    const qtdEstoque = produto && produto.quantidade ? parseFloat(produto.quantidade) : 0;

    // Valida se foi separado
    const isSeparado = separados.includes(insumo.id);

    let st = 'ok'; let label = 'OK';
    if (qtdEstoque === 0) {
      st = 'falta'; label = 'Falta';
    } else if (qtdEstoque < qtdNecessaria) {
      st = 'baixo'; label = `Falta ${qtdNecessaria - qtdEstoque}${produto.unidade}`;
    }

    const clsEstoque = st === 'ok' ? '' : (st === 'falta' ? 'estoque-falta' : 'estoque-baixo');
    const nomeProduto = produto ? produto.nomeProduto : 'Produto não identificado';
    const uni = produto ? produto.unidade : '';

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
  atualizarProgresso(lista, $('main-progress-text'), $('main-progress-pct'),$('main-progress-bar'));
}

function renderChecklistUtensilios(checklists, ficha) {
  const lista = $('util-checklist');
  const nome = $('util-recipe-name');
  const badge = $('util-turma-badge');

  if(nome) nome.textContent = ficha.nomeFicha;
  if(badge) badge.textContent = ficha.turma ? ficha.turma.nomeTurma : '';
  if(!lista) return;

  lista.innerHTML = checklists.map(check => {
    const util = check.utensilio;
    const nomeUtil = util ? util.nomeUtensilio : 'Utensílio não identificado';
    const qtd = util ? util.quantidade : 0;

    // LÓGICA DE VALIDAÇÃO VISUAL (Manutenção/Danificado)
    const estado = check.estadoAtual || 'PRONTO';
    const isInapto = estado !== 'PRONTO';
    const classeInapto = isInapto ? 'text-muted' : '';
    const labelInapto = isInapto ? ` <strong style="color:red; font-size:10px;">(${estado})</strong>` : '';

    // NOVA LÓGICA: Verifica se saiu e ainda não voltou
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
  atualizarProgresso(lista, $('util-progress-text'), $('util-progress-pct'),$('util-progress-bar'));
}

function atualizarProgresso(lista, elText, elPct, elBar) {
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
  const ativar = qtd > LIMITE_SCROLL;
  container.classList.toggle('is-scrollable', ativar);
}

if ($('main-btn-reset')) {
  $('main-btn-reset').addEventListener('click', () => {$('checklist-main').querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    $('checklist-main').dispatchEvent(new Event('change'));
  });
}

// ====================================================================================
// ===== 6. LÓGICA DIRETA DE BANCO DE DADOS: INSUMOS E UTENSÍLIOS  =====
// ====================================================================================

// --- A. CONFIRMAR SEPARAÇÃO (INSUMOS) ---
const btnFinishInsumos = $('btn-finish-insumos');
if (btnFinishInsumos) {
  btnFinishInsumos.addEventListener('click', () => {
    // FILTRA apenas os selecionados que NÃO estão desativados (disabled)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insumosMarcados: insumoIds, observacao: "Separação de Aula confirmada via Painel." })
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
          // Refresh instantâneo SÓ da lista de insumos
          if (fichaAtual) {
            fetch(`/api/fichas/${fichaAtual.id}/detalhes`)
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

// --- B. CONFIRMAR RETIRADA (UTENSÍLIOS) ---
const btnFinishUtensilios = $('btn-finish-utensilios');
if (btnFinishUtensilios) {
  btnFinishUtensilios.addEventListener('click', () => {
    const marcados = document.querySelectorAll('#util-checklist input[type="checkbox"]:checked');
    if (marcados.length === 0) {
      alert("Selecione pelo menos um utensílio para registrar a saída.");
      return;
    }

    // LÓGICA DE VALIDAÇÃO DE TRAVA ESTADO (Inapto)
    const temItemInapto = Array.from(marcados).some(cb => cb.dataset.estado !== 'PRONTO');
    if (temItemInapto) {
      alert("Atenção: Você selecionou utensílios que estão DANIFICADOS ou EM MANUTENÇÃO.\n\nSe eles já foram consertados, selecione-os e clique em 'Registrar Devolução' para atualizar o estado para 'PRONTO' antes de confirmar a saída.");
      return; // Trava a execução aqui
    }

    // Impede de prosseguir se houver item "Em Uso" selecionado
    const temEmUso = Array.from(marcados).some(cb => cb.dataset.emUso === 'true');
    if (temEmUso) {
      alert("Atenção: Você selecionou utensílios que já estão EM USO.\n\nEles não podem ser retirados 2 vezes. Desmarque-os para retirar novos itens ou utilize o botão 'Registrar Devolução'.");
      return; // Trava a execução aqui
    }

    if (!confirm("Confirmar a retirada destes utensílios para a aula? A hora de saída será registrada.")) {
      return;
    }

    const checklistIds = Array.from(marcados).map(cb => parseInt(cb.dataset.id));
    btnFinishUtensilios.innerText = "Processando...";
    btnFinishUtensilios.disabled = true;

    fetch('/api/fichas/confirmar-utensilios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checklistIds: checklistIds })
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
          $('util-checklist').dispatchEvent(new Event('change'));

          // Atualização pontual SÓ da lista de utensílios (não afeta os insumos)
          if (fichaAtual) {
            fetch(`/api/fichas/${fichaAtual.id}/detalhes`)
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

// --- C. REGISTRAR DEVOLUÇÃO (UTENSÍLIOS - ABRE MODAL) ---
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

    $('devolucao-obs').value = 'Devolvido.';$('devolucao-estado').value = 'PRONTO';
    devolucaoModal.classList.add('show');
  });
}

function fecharModalDevolucao() {
  if(devolucaoModal) devolucaoModal.classList.remove('show');
}

if($('devolucao-close'))$('devolucao-close').addEventListener('click', fecharModalDevolucao);
if($('devolucao-cancel'))$('devolucao-cancel').addEventListener('click', fecharModalDevolucao);

if($('devolucao-save')) {$('devolucao-save').addEventListener('click', () => {
  const estadoAtual = $('devolucao-estado').value;
  const obs = $('devolucao-obs').value.trim();

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
        if(!res.ok) throw new Error("Erro ao registrar devolução");
        return res.text();
      })
      .then(msg => {
        alert("Status / Devolução registrada com sucesso no banco de dados!");

        document.querySelectorAll('#util-checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
        $('util-checklist').dispatchEvent(new Event('change'));

        fecharModalDevolucao();

        // Atualização pontual SÓ da lista de utensílios
        if (fichaAtual) {
          fetch(`/api/fichas/${fichaAtual.id}/detalhes`)
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
  sidebar.classList.toggle('open', open);
  if(overlay) overlay.classList.toggle('show', open);
}
menuBtn?.addEventListener('click', () => toggleSidebar(!sidebar.classList.contains('open')));
overlay?.addEventListener('click', () => toggleSidebar(false));

const btnOpenKitchen = $('btn-open-kitchen');
const kitchenModal = $('kitchen-modal');
const kitchenTitle = $('kitchen-title');
const kitchenSteps = $('kitchen-steps');

if(btnOpenKitchen) {
  btnOpenKitchen.addEventListener('click', () => {
    if (!fichaAtual) return;
    if(kitchenTitle) kitchenTitle.textContent = fichaAtual.nomeFicha;

    if(kitchenSteps) {
      if (fichaAtual.preparo) {
        const passos = fichaAtual.preparo.split('\n').filter(p => p.trim() !== '');
        kitchenSteps.innerHTML = passos.map(passo => `<li>${passo}</li>`).join('');
      } else {
        kitchenSteps.innerHTML = `<li>Modo de preparo indisponível.</li>`;
      }
    }
    if(kitchenModal) kitchenModal.classList.add('show');
  });
}

const kitchenClose = $('kitchen-close');
if(kitchenClose) kitchenClose.addEventListener('click', () => { if(kitchenModal) kitchenModal.classList.remove('show'); });