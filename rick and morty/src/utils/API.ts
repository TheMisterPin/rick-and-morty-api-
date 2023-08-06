const url = 'https://rickandmortyapi.com/api';

const urlEpisodes = `${url}/episode`;
const urlLocations = `${url}/location`;
const urlCharacters = `${url}/character`;

export async function getEpisodes() {

    const response = await fetch(urlEpisodes);
    const data = await response.json();
    return data.results;
}


export async function getLocations() {

    const response = await fetch(urlLocations);
    const data = await response.json();
    return data.results;
}


export async function getCharacters() {

    const response = await fetch(urlCharacters);
    const data = await response.json();
    return data.results;
}
