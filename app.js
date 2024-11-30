const express = require('express');
const axios = require('axios');
const app = express();

// Ruta para obtener Pokémon y mostrar sus imágenes en una página HTML
app.get('/pokemons', async (req, res) => {
    try {
        // Obtiene los primeros 10 Pokémon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        const pokemons = response.data.results;

        // Obtener las imágenes de los Pokémon
        const pokemonsWithImages = await Promise.all(pokemons.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            const pokemonImage = pokemonDetails.data.sprites.front_default; // URL de la imagen del Pokémon
            return {
                name: pokemon.name,
                image: pokemonImage,
            };
        }));

        // Crear una página HTML con los Pokémon y sus imágenes
        let html = '<h1>Pokémon</h1>';
        pokemonsWithImages.forEach(pokemon => {
            html += `<h2>${pokemon.name}</h2>`;
            html += `<img src="${pokemon.image}" alt="${pokemon.name}" style="width: 100px; height: 100px;" />`;
        });

        // Enviar la página HTML al cliente
        res.send(html);
    } catch (error) {
        // Si hay algún error, devuelve un mensaje
        res.status(500).send('Error al obtener Pokémon');
    }
});

// Configuración del puerto
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
