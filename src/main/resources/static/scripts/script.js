document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", () => {
            const botao = form.querySelector("button");
            botao.innerText = "Processando...";
            botao.disabled = true;
        });
    });

    // FUNÇÃO CENTRAL (abre receita + atualiza resumo)
    function abrirReceita(recipeId) {
        if (!recipeId) return;

        abrirPassoAPasso(recipeId);
        atualizarResumo(recipeId);
    }

    // ATUALIZA CARD DE RESUMO
    function atualizarResumo(recipeId) {
        const footer = document.getElementById("summary-footer");
        const name = document.getElementById("summary-recipe-name");

        footer.style.display = "flex";
        name.innerText = recipeId;
    }

    // CLIQUE NOS CARDS
    const cards = document.querySelectorAll(".class-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            selecionarCard(card);
            abrirReceita(card.dataset.recipe);
        });
    });

    // MARCA CARD SELECIONADO
    function selecionarCard(card) {
        document.querySelectorAll(".class-card")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
    }

    // BOTÃO DO RESUMO -> MESMA INTERAÇÃO
    const btn = document.getElementById("btn-open-kitchen");

    if (btn) {
        btn.addEventListener("click", () => {
            const selected = document.querySelector(".class-card.selected");
            if (!selected) return;

            abrirReceita(selected.dataset.recipe);
        });
    }

});