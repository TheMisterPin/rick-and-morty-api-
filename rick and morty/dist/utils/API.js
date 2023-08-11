const url = 'https://rickandmortyapi.com/api';
const urlEpisodes = `${url}/episode`;
const urlEpisodesTwo = `${url}/episode?page=2`;
const urlLocations = `${url}/location`;
const urlCharacters = `${url}/character`;
export async function getEpisodes() {
    const response = await fetch(urlEpisodes);
    const data = await response.json();
    return data.results;
}
export async function getEpisodesTwo() {
    const response = await fetch(urlEpisodesTwo);
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
export async function getAllepisodes() {
    let allEpisodes = [];
    for (let i = 1; i < 4; i++) {
        const episodes = await fetchAll(i);
        allEpisodes = [...allEpisodes, ...episodes];
    }
    return allEpisodes;
}
async function fetchAll(i) {
    const response = await fetch(`${url}/episode?page=${i}`);
    const data = await response.json();
    return data.results;
}
export async function getAllLocations() {
    let allLocations = [];
    for (let i = 1; i < 7; i++) { // The API has around 6 pages for locations as of my last training cut-off in September 2021
        const locations = await fetchAllLocations(i);
        allLocations = [...allLocations, ...locations];
    }
    return allLocations;
}
async function fetchAllLocations(i) {
    const response = await fetch(`${url}/location?page=${i}`);
    const data = await response.json();
    return data.results;
}
export async function getAllCharacters() {
    let allCharacters = [];
    for (let i = 1; i < 35; i++) {
        const characters = await fetchAllCharacters(i);
        allCharacters = [...allCharacters, ...characters];
    }
    return allCharacters;
}
async function fetchAllCharacters(i) {
    const response = await fetch(`${url}/character?page=${i}`);
    const data = await response.json();
    return data.results;
}
