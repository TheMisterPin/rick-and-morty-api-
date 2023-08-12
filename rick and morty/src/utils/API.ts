import { Episode } from '../types/Episodes';
import { Character } from '../types/Character';

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

export async function getAllepisodes(): Promise<Episode[]> {
    let allEpisodes: Episode[] = [];

    for (let i = 1; i < 4; i++) {
        const episodes = await fetchAll(i);
        allEpisodes = [...allEpisodes, ...episodes];
    }

    return allEpisodes;
}

async function fetchAll(i: number): Promise<Episode[]> {
    const response = await fetch(`${url}/episode?page=${i}`);
    const data = await response.json();
    return data.results;
}
export async function getAllLocations(): Promise<Location[]> {
    let allLocations: Location[] = [];

    for (let i = 1; i < 7; i++) { 
        const locations = await fetchAllLocations(i);
        allLocations = [...allLocations, ...locations];
    }

    return allLocations;
}

async function fetchAllLocations(i: number): Promise<Location[]> {
    const response = await fetch(`${url}/location?page=${i}`);
    const data = await response.json();
    return data.results;
}


export async function getAllCharacters(): Promise<Character[]> {
    let allCharacters: Character[] = [];

    for (let i = 1; i < 35; i++) {
        const characters = await fetchAllCharacters(i);
        allCharacters = [...allCharacters, ...characters];
    }

    return allCharacters;
}

async function fetchAllCharacters(i: number): Promise<Character[]> {
    const response = await fetch(`${url}/character?page=${i}`);
    const data = await response.json();
    return data.results;
}


export async function getCharacterById(id: number) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const characterData = await response.json();
        return characterData;
    } catch (error) {
        console.error("Error fetching character by ID:", error);
    }
}


