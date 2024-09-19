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
        return data.pokemon.map(p => p.pokemon); // Asegúrate de que esto obtenga solo la información del Pokémon
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
        const pokemonData = await getPokemon(poke.name); // Asegúrate de usar el nombre correcto
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

const totalPokemon = 150; // Cambia este valor si quieres más o menos Pokémon

// Función para obtener todos los Pokémon y llenar las barras desplegables
async function populatePokemonSelects() {
    try {
        const pokemon1Select = document.getElementById('pokemon1-select');
        const pokemon2Select = document.getElementById('pokemon2-select');

        for (let i = 1; i <= totalPokemon; i++) {
            const response = await fetch(`${apiUrl}/${i}`);
            const pokemon = await response.json();

            // Crea una opción para cada Pokémon
            const option1 = document.createElement('option');
            option1.value = pokemon.name;
            option1.textContent = pokemon.name;

            const option2 = option1.cloneNode(true); // Clona la opción para el segundo select

            // Agrega las opciones a ambos select
            pokemon1Select.appendChild(option1);
            pokemon2Select.appendChild(option2);
        }
    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
    }
}

// Función para obtener los datos de un Pokémon por su nombre
async function getPokemonByName(name) {
    try {
        const response = await fetch(`${apiUrl}/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Pokémon no encontrado.');
    }
}

// Función para mostrar los detalles de un Pokémon (imagen y habilidades)
async function showPokemonDetails(pokemonSide) {
    const select = document.getElementById(`${pokemonSide}-select`);
    const pokemonName = select.value;
    const detailsContainer = document.getElementById(`${pokemonSide}-details`);

    if (pokemonName) {
        const pokemon = await getPokemonByName(pokemonName);

        // Mostrar la imagen y las habilidades
        const abilities = pokemon.abilities
            .map(ability => ability.ability.name)
            .slice(0, 3) // Solo mostramos las primeras 3 habilidades
            .join(', ');

        detailsContainer.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Habilidades:</strong> ${abilities}</p>
        `;
    }
}

// Función para comparar dos Pokémon
async function comparePokemon() {
    const pokemon1Name = document.getElementById('pokemon1-select').value;
    const pokemon2Name = document.getElementById('pokemon2-select').value;

    if (pokemon1Name && pokemon2Name) {
        const pokemon1 = await getPokemonByName(pokemon1Name);
        const pokemon2 = await getPokemonByName(pokemon2Name);

        // Comparar el total de estadísticas base de ambos Pokémon
        const totalStats1 = pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0);
        const totalStats2 = pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0);

        const resultContainer = document.getElementById('versus-result');

        // Determinar el ganador
        let winnerText = '';
        if (totalStats1 > totalStats2) {
            winnerText = `<span class="winner">${pokemon1.name.toUpperCase()} gana</span> con un total de ${totalStats1} puntos de estadísticas base contra <span class="loser">${pokemon2.name.toUpperCase()}</span> que tiene ${totalStats2}.`;
        } else if (totalStats1 < totalStats2) {
            winnerText = `<span class="winner">${pokemon2.name.toUpperCase()} gana</span> con un total de ${totalStats2} puntos de estadísticas base contra <span class="loser">${pokemon1.name.toUpperCase()}</span> que tiene ${totalStats1}.`;
        } else {
            winnerText = `¡Es un empate! Ambos tienen ${totalStats1} puntos de estadísticas base.`;
        }

        resultContainer.innerHTML = winnerText;
    }
}

// Llama a la función para llenar los select al cargar la página
window.onload = populatePokemonSelects;
