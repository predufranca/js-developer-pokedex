let count = 649
let offset = 0
let limit = 10
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

class Pokemon {
    name;
    id;
    types = [];
    type;
    photo;
}

function convertPokemonToLi(pokemon) {

    const poke = new Pokemon()
    poke.name = pokemon.name
    poke.id = pokemon.id
    poke.types = pokemon.types.map((typeSlot) => typeSlot.type.name)
    poke.type = poke.types[0]

    return `
        <li class="pokemon ${poke.type}">
            <span class="number">#${poke.id}</span>
            <span class="name">${poke.name}</span>

            <div class="detail">
                <ol class="types">
                    ${poke.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.sprites.other.dream_world.front_default}"
                        alt="${pokemon.name}">
            </div>
        </li>
    `

}

function getPokemons(offset = 0, limit = 5) {

    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`

    fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokemon => fetch(pokemon.url).then((response) => response.json())))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => {

            const newHtml = pokemonDetails.map(convertPokemonToLi)
            pokemonList.innerHTML += newHtml.join('')

    })

}

getPokemons(offset, limit)

loadMoreButton.addEventListener('click', () => {

    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= count) {

        const newLimit = count - offset
        getPokemons(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)

    } else {

        getPokemons(offset, limit)

    }

})