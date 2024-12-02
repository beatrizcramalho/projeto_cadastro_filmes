const form = document.getElementById("cadastroFilme");
const MAX_CARACTERES = 100; // Define o limite de caracteres para a descrição

form.onsubmit = (ev) => {
    ev.preventDefault();

    // Captura os valores dos campos
    const titulo = ev.target.titulo.value.trim();
    const descricao = ev.target.descricao.value.trim();
    const genero = ev.target.genero.value.trim();
    const ano = ev.target.ano.value.trim();
    const urlImagem = ev.target.urlImagem.value.trim();

    // Validação básica
    if (!titulo || !descricao || !genero || !ano || !urlImagem) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    // Validação do ano (4 dígitos)
    if (!/^\d{4}$/.test(ano)) {
        alert("Ano deve conter exatamente 4 dígitos.");
        return;
    }

    // Validação da URL
    if (!/^https?:\/\/.+\..+/.test(urlImagem)) {
        alert("Insira uma URL válida para a imagem.");
        return;
    }

    // Se tudo estiver correto, cria o objeto do filme
    const filme = { titulo, descricao, genero, ano, urlImagem };
    salvaFilme(filme);
    carregaLista();
    form.reset();
};

const salvaFilme = (filme) => {
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    filmes.push(filme);
    localStorage.setItem("filmes", JSON.stringify(filmes));
};

// Função para exibir a lista de filmes
const carregaLista = () => {
    const lista = document.querySelector("div.lista");
    lista.innerHTML = "";
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];

    filmes.forEach(filme => {
        const item = document.createElement("div");
        item.classList.add("item");

        // Limita a descrição e adiciona botão de 'Ler mais' se necessário
        const descricaoCurta = filme.descricao.length > MAX_CARACTERES 
            ? filme.descricao.slice(0, MAX_CARACTERES) + '...' 
            : filme.descricao;

        item.innerHTML = `
            <img src="${filme.urlImagem}" alt="${filme.titulo}" />
            <h2>${filme.titulo}</h2>
            <p><strong>Gênero:</strong> ${filme.genero}</p>
            <p><strong>Ano:</strong> ${filme.ano}</p>
            <p class="descricao-curta">${descricaoCurta}</p>
            ${filme.descricao.length > MAX_CARACTERES 
                ? `<button class="btn-ler-mais" onclick="toggleDescricao(this)">Ler mais</button>` 
                : ''}
        `;
        item.dataset.descricaoCompleta = filme.descricao; // Armazena a descrição completa
        lista.appendChild(item);
    });
};

// Função para expandir/recolher a descrição
const toggleDescricao = (botao) => {
    const item = botao.parentElement;
    const descricaoCurta = item.querySelector('.descricao-curta');
    const descricaoCompleta = item.dataset.descricaoCompleta;

    if (botao.textContent === 'Ler mais') {
        descricaoCurta.textContent = descricaoCompleta;
        botao.textContent = 'Ler menos';
    } else {
        descricaoCurta.textContent = descricaoCompleta.slice(0, MAX_CARACTERES) + '...';
        botao.textContent = 'Ler mais';
    }
};

// Função filtrar filmes por gênero ou ano
const filtrarFilmes = () => {
    const generoFiltro = document.getElementById('filtroGenero').value.trim().toLowerCase();
    const anoFiltro = document.getElementById('filtroAno').value.trim();

    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const lista = document.querySelector("div.lista");
    lista.innerHTML = "";

    const filmesFiltrados = filmes.filter(filme => {
        return (generoFiltro === "" || filme.genero.toLowerCase().includes(generoFiltro)) &&
               (anoFiltro === "" || filme.ano.includes(anoFiltro));
    });

    if (filmesFiltrados.length === 0) {
        // Cria e exibe mensagem de "nenhum filme encontrado"
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum filme encontrado com os critérios selecionados.";
        mensagem.style.color = "red";
        mensagem.style.textAlign = "center";
        lista.appendChild(mensagem);
    } else {
        filmesFiltrados.forEach(filme => {
            const item = document.createElement("div");
            item.classList.add("item");
            item.innerHTML = `<img src="${filme.urlImagem}" alt="${filme.titulo}" />
                              <h2>${filme.titulo}</h2>
                              <p><strong>Gênero:</strong> ${filme.genero}</p>
                              <p><strong>Ano:</strong> ${filme.ano}</p>
                              <p>${filme.descricao}</p>`;
            lista.appendChild(item);
        });
    }
};

// Adiciona evento para a tecla 'Enter'
document.getElementById('filtroGenero').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filtrarFilmes();
    }
});

// Adiciona evento para a tecla 'Enter'
document.getElementById('filtroAno').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filtrarFilmes();
    }
});

// Função para limpar os filtros e recarregar a lista completa
const limparFiltros = () => {
    document.getElementById('filtroGenero').value = '';
    document.getElementById('filtroAno').value = '';
    carregaLista(); // Recarrega todos os filmes sem filtro
};

// Carrega a lista ao abrir a página
window.onload = carregaLista;