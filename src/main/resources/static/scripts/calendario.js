document.addEventListener("DOMContentLoaded", () => {

    // Inicializa na data atual
    let dataCalendario = new Date();
    let diaSelecionadoGlobal = new Date().getDate();

    // Quantidade de fichas alocadas por data
    let alocacoesPorData = {};


    const nomesMeses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];


    // =========================================================
    // VERIFICA SE A DATA É SÁBADO OU DOMINGO
    // =========================================================

    function isFimDeSemana(dataIso) {

        // Garante que a data esteja realmente no formato YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) {
            return false;
        }

        const [ano, mes, dia] =
            dataIso.split("-").map(Number);

        /*
         * Usa UTC para evitar problemas de fuso horário.
         *
         * getUTCDay():
         * 0 = Domingo
         * 1 = Segunda
         * 2 = Terça
         * 3 = Quarta
         * 4 = Quinta
         * 5 = Sexta
         * 6 = Sábado
         */
        const data = new Date(
            Date.UTC(ano, mes - 1, dia)
        );

        const diaSemana =
            data.getUTCDay();

        return (
            diaSemana === 0 ||
            diaSemana === 6
        );
    }


    // =========================================================
    // ELEMENTOS DO HTML
    // =========================================================

    const grid =
        document.getElementById("cal-grid");

    const indicadorMes =
        document.getElementById("cal-month");

    const labelDataPainel =
        document.getElementById("cal-panel-date");

    const containerAlocadas =
        document.getElementById("cal-allocated");

    const containerDisponiveis =
        document.getElementById("cal-available");

    const btnPrev =
        document.getElementById("cal-prev");

    const btnNext =
        document.getElementById("cal-next");


    const dialogConfirmacao =
        document.getElementById("modal-confirmacao");


    const btnConfirmarExclusao =
        document.getElementById(
            "btn-confirmar-exclusao"
        );


    const btnCancelarExclusao =
        document.getElementById(
            "btn-cancelar-exclusao"
        );


    let fichaIdParaDesalocar = null;


    // =========================================================
    // MODAL DE CONFIRMAÇÃO
    // =========================================================

    if (btnCancelarExclusao) {

        btnCancelarExclusao.addEventListener(
            "click",
            () => {

                if (dialogConfirmacao) {
                    dialogConfirmacao.close();
                }

                fichaIdParaDesalocar = null;
            }
        );
    }


    if (btnConfirmarExclusao) {

        btnConfirmarExclusao.addEventListener(
            "click",
            () => {

                if (fichaIdParaDesalocar === null) {
                    return;
                }


                fetch(
                    `/calendario/desalocar?id=${fichaIdParaDesalocar}`,
                    {
                        method: "POST"
                    }
                )

                    .then(response => {

                        if (!response.ok) {

                            throw new Error(
                                "Erro ao desalocar a ficha"
                            );
                        }


                        if (dialogConfirmacao) {
                            dialogConfirmacao.close();
                        }


                        fichaIdParaDesalocar = null;


                        carregarAlocacoesERenderizarGrid();
                    })


                    .catch(erro => {

                        console.error(
                            "Erro ao remover ficha:",
                            erro
                        );


                        alert(
                            "Ocorreu um erro ao tentar retirar a ficha do calendário."
                        );
                    });
            }
        );
    }


    // =========================================================
    // CARREGA AS FICHAS JÁ ALOCADAS
    // =========================================================

    function carregarAlocacoesERenderizarGrid() {

        fetch(
            "/calendario/fichas-alocadas"
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Erro ao buscar fichas alocadas. HTTP ${response.status}`
                    );
                }


                return response.json();
            })


            .then(fichas => {

                alocacoesPorData = {};


                fichas.forEach(ficha => {

                    if (ficha.data) {

                        alocacoesPorData[ficha.data] =
                            (
                                alocacoesPorData[ficha.data] ||
                                0
                            ) + 1;
                    }
                });


                renderizarGrid();
            })


            .catch(erro => {

                console.error(
                    "Erro ao carregar fichas alocadas:",
                    erro
                );


                renderizarGrid();
            });
    }


    // =========================================================
    // RENDERIZA O CALENDÁRIO
    // =========================================================

    function renderizarGrid() {

        if (!grid) {
            return;
        }


        grid.innerHTML = "";


        const ano =
            dataCalendario.getFullYear();

        const mes =
            dataCalendario.getMonth();


        // =====================================================
        // ATUALIZA NOME DO MÊS
        // =====================================================

        if (indicadorMes) {

            indicadorMes.textContent =
                `${nomesMeses[mes]} ${ano}`;
        }


        const primeiroDiaSemana =
            new Date(
                ano,
                mes,
                1
            ).getDay();


        const totalDiasNoMes =
            new Date(
                ano,
                mes + 1,
                0
            ).getDate();


        // =====================================================
        // EVITA SELECIONAR DIA INEXISTENTE
        // =====================================================

        if (
            diaSelecionadoGlobal >
            totalDiasNoMes
        ) {

            diaSelecionadoGlobal =
                totalDiasNoMes;
        }


        // =====================================================
        // ESPAÇOS ANTES DO PRIMEIRO DIA
        // =====================================================

        for (
            let i = 0;
            i < primeiroDiaSemana;
            i++
        ) {

            const espaco =
                document.createElement("div");


            espaco.className =
                "day-cell space";


            grid.appendChild(espaco);
        }


        // =====================================================
        // CRIA OS DIAS DO MÊS
        // =====================================================

        for (
            let dia = 1;
            dia <= totalDiasNoMes;
            dia++
        ) {

            const celula =
                document.createElement("div");


            celula.className =
                "day-cell";


            const spanNumero =
                document.createElement("span");


            spanNumero.textContent =
                dia;


            celula.appendChild(
                spanNumero
            );


            // =================================================
            // DATA NO FORMATO ISO YYYY-MM-DD
            // =================================================

            const strMes =
                String(mes + 1)
                    .padStart(2, "0");


            const strDia =
                String(dia)
                    .padStart(2, "0");


            const dataIso =
                `${ano}-${strMes}-${strDia}`;


            celula.setAttribute(
                "data-date",
                dataIso
            );


            // =================================================
            // VERIFICA SE É FIM DE SEMANA
            // =================================================

            const fimDeSemana =
                isFimDeSemana(dataIso);


            if (fimDeSemana) {

                celula.classList.add(
                    "weekend"
                );
            }


            // =================================================
            // BOLINHAS DAS FICHAS ALOCADAS
            // =================================================

            if (
                alocacoesPorData[dataIso]
            ) {

                const quantidadeFichas =
                    alocacoesPorData[dataIso];


                const containerBolinhas =
                    document.createElement("div");


                containerBolinhas.className =
                    "indicator-dots";


                containerBolinhas.style.justifyContent =
                    "flex-end";


                containerBolinhas.style.marginLeft =
                    "auto";


                containerBolinhas.style.marginTop =
                    "auto";


                for (
                    let k = 0;
                    k < quantidadeFichas;
                    k++
                ) {

                    const bolinha =
                        document.createElement("div");


                    bolinha.className =
                        "dot orange";


                    containerBolinhas.appendChild(
                        bolinha
                    );
                }


                celula.appendChild(
                    containerBolinhas
                );
            }


            // =================================================
            // DIA SELECIONADO
            // =================================================

            /*
             * Importante:
             * sábado e domingo nunca podem ser
             * selecionados automaticamente.
             */

            if (
                dia === diaSelecionadoGlobal &&
                !fimDeSemana
            ) {

                celula.classList.add(
                    "active-selected"
                );


                buscarFichasViaHibernate(
                    dataIso,
                    dia,
                    nomesMeses[mes],
                    ano
                );
            }


            // =================================================
            // CLIQUE NO DIA
            // =================================================

            celula.addEventListener(
                "click",
                () => {

                    // =================================================
                    // TRAVA DE SEGURANÇA
                    // =================================================
                    // Se for sábado ou domingo,
                    // simplesmente ignora o clique.
                    // Não seleciona e não abre o painel.

                    if (
                        isFimDeSemana(dataIso)
                    ) {

                        return;
                    }


                    // Remove seleção anterior
                    document
                        .querySelectorAll(
                            ".day-cell"
                        )
                        .forEach(c => {

                            c.classList.remove(
                                "active-selected"
                            );
                        });


                    // Seleciona o novo dia
                    celula.classList.add(
                        "active-selected"
                    );


                    diaSelecionadoGlobal =
                        dia;


                    // Abre o painel somente
                    // para segunda a sexta
                    buscarFichasViaHibernate(
                        dataIso,
                        dia,
                        nomesMeses[mes],
                        ano
                    );
                }
            );


            grid.appendChild(
                celula
            );
        }
    }


    // =========================================================
    // BUSCA AS FICHAS DO DIA
    // =========================================================

    function buscarFichasViaHibernate(
        dataIso,
        dia,
        nomeMes,
        ano
    ) {

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


        fetch(
            `/calendario/fichas?data=${dataIso}`
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Erro na resposta do servidor. HTTP ${response.status}`
                    );
                }


                return response.json();
            })


            .then(dados => {

                console.log(
                    "Dados recebidos do backend:",
                    dados
                );


                containerAlocadas.innerHTML = "";

                containerDisponiveis.innerHTML = "";


                // =================================================
                // FICHAS ALOCADAS
                // =================================================

                if (
                    !dados.alocadas ||
                    dados.alocadas.length === 0
                ) {

                    containerAlocadas.innerHTML =
                        '<p class="crumb-muted">Nenhuma aula ou ficha programada para este dia.</p>';

                } else {

                    dados.alocadas.forEach(
                        ficha => {

                            console.log(
                                "Ficha alocada:",
                                ficha
                            );


                            containerAlocadas.appendChild(
                                criarCardFicha(
                                    ficha.id,

                                    // NOME CORRETO DA ENTIDADE FICHA
                                    ficha.nomeFicha,

                                    "success",

                                    "delete"
                                )
                            );
                        }
                    );
                }


                // =================================================
                // FICHAS DISPONÍVEIS
                // =================================================

                if (
                    !dados.Disponiveis ||
                    dados.Disponiveis.length === 0
                ) {

                    containerDisponiveis.innerHTML =
                        '<p class="crumb-muted">Acervo vazio.</p>';

                } else {

                    dados.Disponiveis.forEach(
                        ficha => {

                            console.log(
                                "Ficha disponível:",
                                ficha
                            );


                            containerDisponiveis.appendChild(
                                criarCardFicha(
                                    ficha.id,

                                    // NOME CORRETO DA ENTIDADE FICHA
                                    ficha.nomeFicha,

                                    "warning",

                                    "append"
                                )
                            );
                        }
                    );
                }
            })


            .catch(erro => {

                console.error(
                    "Erro ao carregar fichas:",
                    erro
                );


                containerAlocadas.innerHTML =
                    '<p style="color: red;">Erro ao carregar dados.</p>';


                containerDisponiveis.innerHTML =
                    '<p style="color: red;">Erro ao carregar dados.</p>';
            });
    }


    // =========================================================
    // CRIA CARD DA FICHA
    // =========================================================

    function criarCardFicha(
        id,
        nome,
        status,
        acao
    ) {

        const card =
            document.createElement("div");


        card.className =
            "fiche-card";


        const icone =
            status === "success"
                ? "check_circle"
                : "warning";


        const textoEstoque =
            status === "success"
                ? "Estoque Completo"
                : "Verificar Insumos";


        card.innerHTML = `
            <div class="fiche-info">

                <p class="fiche-name">
                    ${nome}
                </p>

                <span class="stock-status ${status}">

                    <span class="material-symbols-outlined">
                        ${icone}
                    </span>

                    ${textoEstoque}

                </span>

            </div>

            <button class="btn-fiche-action ${acao}">

                <span class="material-symbols-outlined">

                    ${
            acao === "delete"
                ? "close"
                : "add"
        }

                </span>

            </button>
        `;


        // =====================================================
        // BOTÃO +
        // =====================================================

        if (
            acao === "append"
        ) {

            const botaoAdicionar =
                card.querySelector(
                    ".btn-fiche-action"
                );


            botaoAdicionar.addEventListener(
                "click",
                () => {

                    const celulaAtiva =
                        document.querySelector(
                            ".day-cell.active-selected"
                        );


                    // Se não existe dia selecionado
                    if (!celulaAtiva) {
                        return;
                    }


                    const dataIso =
                        celulaAtiva.getAttribute(
                            "data-date"
                        );


                    // =================================================
                    // TRAVA EXTRA DE SEGURANÇA
                    // =================================================
                    /*
                     * Mesmo que alguém tente burlar o bloqueio
                     * alterando o DOM manualmente, essa verificação
                     * impede que a requisição de alocação seja enviada.
                     */

                    if (
                        !dataIso ||
                        isFimDeSemana(dataIso)
                    ) {

                        alert(
                            "Não é possível alocar receitas aos sábados e domingos."
                        );


                        return;
                    }


                    // =================================================
                    // ALLOCAÇÃO
                    // =================================================

                    fetch(
                        `/calendario/alocar?id=${id}&data=${dataIso}`,
                        {
                            method: "GET"
                        }
                    )

                        .then(response => {

                            if (!response.ok) {

                                throw new Error(
                                    "Erro ao alocar ficha"
                                );
                            }


                            carregarAlocacoesERenderizarGrid();
                        })


                        .catch(erro => {

                            console.error(
                                "Erro na alocação:",
                                erro
                            );
                        });
                }
            );
        }


        // =====================================================
        // BOTÃO X
        // =====================================================

        if (
            acao === "delete"
        ) {

            const botaoRemover =
                card.querySelector(
                    ".btn-fiche-action"
                );


            botaoRemover.addEventListener(
                "click",
                () => {

                    fichaIdParaDesalocar =
                        id;


                    // Se existir modal
                    if (
                        dialogConfirmacao
                    ) {

                        dialogConfirmacao.showModal();

                    } else {

                        // Caso não exista modal no HTML
                        fetch(
                            `/calendario/desalocar?id=${id}`,
                            {
                                method: "POST"
                            }
                        )

                            .then(response => {

                                if (!response.ok) {

                                    throw new Error(
                                        "Erro ao desalocar ficha"
                                    );
                                }


                                carregarAlocacoesERenderizarGrid();
                            })


                            .catch(erro => {

                                console.error(
                                    "Erro ao desalocar:",
                                    erro
                                );
                            });
                    }
                }
            );
        }


        return card;
    }


    // =========================================================
    // MÊS ANTERIOR
    // =========================================================

    if (btnPrev) {

        btnPrev.addEventListener(
            "click",
            () => {

                dataCalendario.setMonth(
                    dataCalendario.getMonth() - 1
                );


                carregarAlocacoesERenderizarGrid();
            }
        );
    }


    // =========================================================
    // PRÓXIMO MÊS
    // =========================================================

    if (btnNext) {

        btnNext.addEventListener(
            "click",
            () => {

                dataCalendario.setMonth(
                    dataCalendario.getMonth() + 1
                );


                carregarAlocacoesERenderizarGrid();
            }
        );
    }


    // =========================================================
    // INICIALIZA O CALENDÁRIO
    // =========================================================

    carregarAlocacoesERenderizarGrid();

});