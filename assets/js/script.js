const baseURL = "http://localhost:3002/pizzas"

// Get all --------------------------------------------------
async function findAllPizzas() {
    const response = await fetch(`${baseURL}/catalogo-pizzas`);
    const pizzas = await response.json();

    pizzas.forEach(function (pizza) {
        document.querySelector('#pizzaList').insertAdjacentHTML('beforeend',
            `
        <div class="PizzaListaItem">

          <div>
            <div class="PizzaListaItem__numero">#${pizza.id}</div>
            <div class="PizzaListaItem__sabor">${pizza.sabor}</div>
            <div class="PizzaListaItem__preco">R$ ${pizza.preco}</div>
            <div class="PizzaListaItem__descricao">${pizza.descricao}</div>
            <div class="PizzaListaItem__avaliacao">${pizza.avaliacao}⭐</div>
          </div>
            <img class="PizzaListaItem__foto" src="${pizza.image}" width="50%" alt="Pizza de ${pizza.sabor}"/>
        </div>
        `)
    });
}

// Get By Id -------------------------------------------------
async function findByIdPizza() {
    const idPizza = document.querySelector('#idPizza').value;

    const response = await fetch(`${baseURL}/pizza/${idPizza}`);
    const pizza = await response.json();

    const divPizzaEscolhida = document.querySelector('#pizzaEscolhida');

    if (pizza.id == undefined) {
        alert('Pizza não encontrada!');
        return;
    }

    divPizzaEscolhida.innerHTML =
        `
    <div class="pizzaCardItem">
        <div>
        <div class="pizzaCardItem__numero">#${pizza.id}</div>
        <div class="pizzaCardItem__sabor">${pizza.sabor}</div>
        <div class="pizzaCardItem__preco">R$ ${pizza.preco}</div>
        <div class="pizzaCardItem__descricao">${pizza.descricao}</div>
        <div class="pizzaCardItem__avaliacao">${pizza.avaliacao}⭐</div>
        </div>
        <img class="pizzaCardItem__foto" src="${pizza.image}" width="50%" alt="Pizza de ${pizza.sabor}"/>
    </div>
    `
}

findAllPizzas();

// ------------------------------------------------------- Modal -----------------------------------------------
function openModal() {
    const modal = document.querySelector('#overlay');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.querySelector('#overlay');
    modal.style.display = 'none';
}