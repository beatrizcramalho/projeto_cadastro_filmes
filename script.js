const form = document.getElementById("cadastroFilme");

form.onsubmit = (ev) => {
    ev.preventDefault();
    
    const filme = {
        titulo: ev.target.titulo.value,
        descricao: ev.target.descricao.value,
        genero: ev.target.genero.value,
        ano: ev.target.ano.value,
        urlImagem: ev.target.urlImagem.value
    };

    salvaFilme(filme);
    carregaLista();
    form.reset();
};

const salvaFilme = (filme) => {
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    filmes.push(filme);
    localStorage.setItem("filmes", JSON.stringify(filmes));
};

const carregaLista = () => {
    const lista = document.querySelector("div.lista");
    lista.innerHTML = "";
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];

    filmes.forEach(filme => {
        const item = document.createElement("div");
        item.classList.add("item");

        item.innerHTML = `<img src="${filme.urlImagem}" alt="${filme.titulo}" />
                            <h2>${filme.titulo}</h2>
                            <p><strong>Gênero:</strong> ${filme.genero}</p>
                            <p><strong>Ano:</strong> ${filme.ano}</p>
                            <p>${filme.descricao}</p>`;

        lista.appendChild(item);
    });
};

// Carrega a lista ao abrir a página
window.onload = carregaLista;