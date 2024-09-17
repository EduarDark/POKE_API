const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const typeUrl = 'https://pokeapi.co/api/v2/type';
const pokemonContainer = document.getElementById('pokemon-container');

// Función para obtener los datos de un Pokémon por su nombre o ID
async function getPokemon(query) {
    try {
        const response = await fetch(`${apiUrl}/${query.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.error(error);
        alert('Pokémon no encontrado. Intenta con un nombre o ID válido.');
    }
}

// Función para obtener Pokémon por tipo
async function getPokemonsByType(type) {
    try {
        const response = await fetch(`${typeUrl}/${type}`);
        if (!response.ok) {
            throw new Error('Tipo de Pokémon no encontrado');
        }
        const data = await response.json();
        return data.pokemon.slice(0, 10); // Tomamos solo los primeros 10 Pokémon
    } catch (error) {
        console.error(error);
        alert('No se encontraron Pokémon de este tipo.');
    }
}

// Función para mostrar la tarjeta de un Pokémon
function displayPokemon(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="pokemon-name">${pokemon.name}</div>
    `;

    pokemonContainer.appendChild(pokemonCard);
}

// Función para mostrar múltiples Pokémon
async function displayPokemons(pokemons) {
    pokemonContainer.innerHTML = ''; // Limpiar el contenedor
    for (const poke of pokemons) {
        const pokemonData = await getPokemon(poke.pokemon.name);
        if (pokemonData) {
            displayPokemon(pokemonData);
        }
    }
}

// Función para buscar un Pokémon cuando el usuario escribe
async function searchPokemon() {
    const searchInput = document.getElementById('pokemon-search').value;
    if (searchInput) {
        const pokemon = await getPokemon(searchInput);
        if (pokemon) {
            pokemonContainer.innerHTML = ''; // Limpiar el contenedor
            displayPokemon(pokemon);
        }
    }
}

// Función para buscar Pokémon por tipo
async function searchByType() {
    const selectedType = document.getElementById('pokemon-type').value;
    if (selectedType) {
        const pokemonsByType = await getPokemonsByType(selectedType);
        if (pokemonsByType) {
            displayPokemons(pokemonsByType);
        }
    }
}
