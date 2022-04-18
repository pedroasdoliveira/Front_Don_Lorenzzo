const baseURL = "http://localhost:3002/pizzas"

// -------------------------------------------------------- Get All -------------------------------------
async function findAllPizzas() {
    const response = await fetch(`${baseURL}/catalogo-pizzas`);
    const pizzas = await response.json();

    pizzas.forEach(function (pizza) {
        document.querySelector('#pizzaList').insertAdjacentHTML('beforeend',
            `
        <div class="PizzaListaItem" id="PizzaListaItem_${pizza.id}">

          <div>
            <div class="PizzaListaItem__numero">#${pizza.id}</div>
            <div class="PizzaListaItem__sabor">${pizza.sabor}</div>
            <div class="PizzaListaItem__preco">R$ ${pizza.preco}</div>
            <div class="PizzaListaItem__descricao">${pizza.descricao}</div>
            <div class="PizzaListaItem__avaliacao">${pizza.avaliacao}⭐</div>
                <div class="PizzaListaItem__btns">
                    <button class="edit btn" onclick="openModal(${pizza.id})">Editar</button>
                    <button class="delete btn" onclick="openModalDelete(${pizza.id})">Apagar</button>
                </div>
            </div>
            <img class="PizzaListaItem__foto" src="${pizza.image}" width="50%" alt="Pizza de ${pizza.sabor}"/>
        </div>
        `)
    });
}

// ---------------------------------------------------- Get By Id -----------------------------------
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
    <div class="pizzaCardItem" id="PizzaListaItem_${pizza.id}">
        <div>
        <div class="pizzaCardItem__numero">#${pizza.id}</div>
        <div class="pizzaCardItem__sabor">${pizza.sabor}</div>
        <div class="pizzaCardItem__preco">R$ ${pizza.preco}</div>
        <div class="pizzaCardItem__descricao">${pizza.descricao}</div>
        <div class="pizzaCardItem__avaliacao">${pizza.avaliacao}⭐</div>
        </div>
        <div class="PizzaListaItem__btns">
            <button class="edit btn" onclick="openModal(${pizza.id})">Editar</button>
            <button class="delete btn" onclick="openModalDelete(${pizza.id})">Apagar</button>
        </div>
        <img class="pizzaCardItem__foto" src="${pizza.image}" width="50%" alt="Pizza de ${pizza.sabor}"/>
    </div>
    `
}

findAllPizzas();

// ------------------------------------------------------- Modal -----------------------------------------------
async function openModal(id = null) {
    if (id != null) {
        document.querySelector('#header-modal').innerText = 'Editar Pizza';
        document.querySelector('#button-modal').innerText = 'Editar';

        const response = await fetch(`${baseURL}/pizza/${id}`);
        const pizza = await response.json();
        
        document.querySelector('#id').value = pizza.id;
        document.querySelector('#sabor').value = pizza.sabor;
        document.querySelector('#preco').value = pizza.preco;
        document.querySelector('#descricao').value = pizza.descricao;
        document.querySelector('#avaliacao').value = pizza.avaliacao;
        document.querySelector('#image').value = pizza.image;
    }
    else {
        document.querySelector('#header-modal').innerText = 'Adicionar nova pizza';
        document.querySelector('#button-modal').innerText = 'Adicionar';
    }

    const modal = document.querySelector('#overlay');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.querySelector('#overlay');
    modal.style.display = 'none';

    document.querySelector('#sabor').value = '';
    document.querySelector('#preco').value = 0;
    document.querySelector('#descricao').value = '';
    document.querySelector('#avaliacao').value = 0;
    document.querySelector('#image').value = '';
}

// ---------------------------------------------- Alert -----------------------------------------------------
let seconds;
let timer;

function openMessage() {
    const alert = document.querySelector('#alert');
    alert.style.display = 'flex';
    
    seconds = 0;
    timer = setInterval(function() {
        seconds++;

        if (seconds == 5) {
            closeMessage();
        }
    }, 1000);
}

function closeMessage() {
    clearInterval(timer);
    const alert = document.querySelector('#alert');
    alert.style.display = 'none';
}

// ----------------------------------------- Modal create and update ------------------------------
async function addPizza(event) {
    event.preventDefault();

    const id = document.querySelector('#id').value;
    const sabor = document.querySelector('#sabor').value;
    const preco = document.querySelector('#preco').value;
    const descricao = document.querySelector('#descricao').value;
    const avaliacao = document.querySelector('#avaliacao').value;
    const image = document.querySelector('#image').value;

    const pizza = {
        id,
        sabor,
        preco,
        descricao,
        avaliacao,
        image,
    };

    const modo = id > 0;

    const endpoint = baseURL + (modo ? `/updated/${id}` : `/create`); // ------------ operação ternaria

    const response = await fetch(endpoint, {
        method: modo ? 'put' : 'post',
        headers: {
            "content-Type": "application/json",
        },
        mode: 'cors',
        body: JSON.stringify(pizza),
    });

    const newPizza = await response.json();

    const html = `
    <div class="PizzaListaItem" id="PizzaListaItem_${pizza.id}">

        <div>
            <div class="PizzaListaItem__numero">#${newPizza.id}</div>
            <div class="PizzaListaItem__sabor">${newPizza.sabor}</div>
            <div class="PizzaListaItem__preco">R$ ${newPizza.preco}</div>
            <div class="PizzaListaItem__descricao">${newPizza.descricao}</div>
            <div class="PizzaListaItem__avaliacao">${newPizza.avaliacao}⭐</div>
            <div class="PizzaListaItem__btns">
                <button class="edit btn" onclick="openModal(${pizza.id})">Editar</button>
                <button class="delete btn" onclick="openModalDelete(${pizza.id})">Apagar</button>
            </div>
        </div>
        <img class="PizzaListaItem__foto" src="${newPizza.image}" width="50%" alt="Pizza de ${newPizza.sabor}"/>
    </div>
    `;

    if (modo) {
        document.querySelector(`#PizzaListaItem_${id}`).outerHTML = html
    }
    else {
        document.querySelector('#pizzaList').insertAdjacentHTML('beforeend', html);
        openMessage();
    }

    closeModal();
};

// ---------------------------------------------- Modal delete -----------------------------------
function openModalDelete(id) {
    document.querySelector('#overlay-delete').style.display = 'flex';

    const btnDelete = document.querySelector('.btns_yes');

    btnDelete.addEventListener('click', function() {
        deletePizza(id);
    })
}

function closeModalDelete() {
    document.querySelector('#overlay-delete').style.display = 'none';
}

async function deletePizza(id) {
    const response = await fetch(`${baseURL}/delete/${id}`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    });

    const result = await response.json();
    alert(result.message);

    document.querySelector('#pizzaList').innerHTML = '';

    closeModalDelete();
    findAllPizzas();
}