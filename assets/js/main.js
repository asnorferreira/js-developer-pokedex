const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonCardContainer = document.getElementById('pokemonCardContainer');
const backButton = document.getElementById('backButton');
const maxRecords = 1281;
const limit = 12; 

let offset = 0;
let loadedPokemon = []; 
let displayedPokemon = [];
let isLoading = false; 

function convertPokemonToLi(pokemon) {
    const primaryType = pokemon.types[0].toLowerCase();
    const typeClasses = primaryType;
    return `
        <li class="pokemon ${typeClasses}" data-pokemon="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type.toLowerCase()}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}
function loadPokemonList() {
    if (isLoading) return; 
    isLoading = true;
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        loadedPokemon = loadedPokemon.concat(pokemons);
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
        pokemons.forEach((pokemon) => {
            const pokemonItem = document.querySelector(`[data-pokemon="${pokemon.number}"]`);
            pokemonItem.addEventListener('click', () => {
                exibirPerfilPokemon(pokemon);
            });
        });
    
        displayedPokemon = displayedPokemon.concat(pokemons);
        offset += limit; 
        isLoading = false; 

        if (offset >= maxRecords) {
            loadMoreButton.style.display = 'none'; 
            loadMoreButton.style.display = 'block';
        }
    });
}
function exibirPerfilPokemon(pokemon) {
    pokemonList.style.display = 'none'; 
    loadMoreButton.style.display = 'none'; 
    pokemonCardContainer.style.display ='block';
    backButton.style.display = 'block'; 
    const loadedDetails = loadedPokemon.find((p) => p.number === pokemon.number);

    if (loadedDetails) {
        exibirCardComDetalhes(loadedDetails); 
    } else {
        pokeApi.getPokemonDetail(pokemon).then((detailedPokemon) => {
            exibirCardComDetalhes(detailedPokemon);
        });
    }
}
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    if (pokeDetail.height && pokeDetail.weight) {
        pokemon.height = `${pokeDetail.height / 10} m`;
        pokemon.weight = `${pokeDetail.weight / 10} kg`;
    }
    return pokemon;   
}
function exibirCardComDetalhes(pokemon) {
    const cardHtml = `
        <div class="pokemon-card">
            <h1 class="name">${pokemon.name}</h1>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <p class="type"><strong>Tipo:</strong> ${pokemon.types.join(', ')}</p>
            <p class="height"><strong>Altura:</strong> ${pokemon.height}</p>
            <p class="weight"><strong>Peso:</strong> ${pokemon.weight}</p>
        </div>
    `;
    pokemonCardContainer.innerHTML = cardHtml;
}
function voltarParaPokedex() {
    pokemonList.style.display = 'grid';
    pokemonCardContainer.style.display = 'none';
    backButton.style.display = 'none';
    pokemonCardContainer.innerHTML = '';
    loadMoreButton.style.display = 'block';
}
backButton.style.display = 'none';
backButton.addEventListener('click', voltarParaPokedex);
window.addEventListener('load', loadPokemonList);
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonList();
});
pokemonList.addEventListener('click', (event) => {
    const targetPokemon = event.target.closest('[data-pokemon]');
    
    if (targetPokemon) {
        const pokemonNumber = parseInt(targetPokemon.getAttribute('data-pokemon'));
        const pokemon = displayedPokemon.find((p) => p.number === pokemonNumber);
        
        if (pokemon) {
            exibirPerfilPokemon(pokemon);
        }
    }
});






