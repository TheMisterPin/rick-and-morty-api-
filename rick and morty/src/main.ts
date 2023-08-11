import { Episode } from './types/Episodes';
import { Character } from './types/Character';
import { Location } from './types/Location'
import { getAllepisodes, getAllCharacters, getAllLocations } from './utils/API.js';
import {getCharacters} from './utils/API.js'
document.addEventListener("DOMContentLoaded", () => { init() });


function init() {
    console.log("Init function called");
    generateLayout();
    generateAccordion();
}

function generateLayout() {
    document.body.appendChild(generateSidebar());
    document.body.appendChild(generateDisplay());
}

function generateSidebar(): HTMLElement {
    const asideElement = createElement('aside', ['sidebar']);
    const accordionDiv = createElement('div', ['accordionContainer', 'accordion']);
    asideElement.appendChild(accordionDiv);
    return asideElement;
}

function generateDisplay(): HTMLElement {
    const display = createElement('output', ['display']);
    display.innerHTML = '';
    return display;
}

function createElement(tag: string, classes: string[] = [], attributes: { [key: string]: string } = {}): HTMLElement {
    const elem = document.createElement(tag);
    elem.classList.add(...classes);
    for (const key in attributes) {
        elem.setAttribute(key, attributes[key]);
    }
    return elem;
}

async function generateAccordion() {
    const accordionContainer = document.querySelector('.accordionContainer');
    if (!accordionContainer) return;

    const episodes = await getAllepisodes();
    const categorizedSeasons = seasonSelector(episodes);
    for (const season in categorizedSeasons) {
        const seasonDiv = createElement('div', ['accordion-item']);
        const seasonHeader = generateAccordionHeader(season);
        seasonDiv.appendChild(seasonHeader);
        const seasonBody = generateAccordionBody(season, categorizedSeasons[season]);
        seasonDiv.appendChild(seasonBody);
        accordionContainer.appendChild(seasonDiv);
    }
}

function formatSeasonString(season: string): string {
    const match = season.match(/\d+/);
    if (!match) {
        throw new Error(`Failed to extract a number from the season string: ${season}`);
    }
    const seasonNumber = match[0];
    return `Season ${seasonNumber}`;
}

function generateAccordionHeader(season: string): HTMLElement {
    const seasonHeader = createElement('h2', ['accordion-header'], { id: `heading${season}` });
    const seasonButton = createElement('button', ['accordion-button', 'collapsed'], {
        'type': 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': `#collapse${season}`
    });

    const seasonString = formatSeasonString(season);
    seasonButton.innerText = seasonString;

    seasonButton.addEventListener('click', async () => {
        const episodesForSeason = await getEpisodesForSeason(season);
        generateSeasonCards(episodesForSeason);
    });

    seasonHeader.appendChild(seasonButton);
    return seasonHeader;
}

function generateAccordionBody(season: string, episodes: any[]): HTMLElement {
    const seasonCollapseDiv = createElement('div', ['accordion-collapse', 'collapse'], {
        id: `collapse${season}`,
        'aria-labelledby': `heading${season}`,
        'data-bs-parent': ".accordion"
    });
    const episodesDiv = createElement('div', ['d-flex', 'flex-column', 'text-center']);
    episodes.forEach(episode => {
        const episodeDiv = createElement('a', ['episode-item'], { href: `#${episode.id}` });
        episodeDiv.innerText = episode.name;
        episodeDiv.setAttribute('data-id', episode.id.toString());
        // Removed the click event listener from here
        episodesDiv.appendChild(episodeDiv);
    });
    seasonCollapseDiv.appendChild(episodesDiv);
    return seasonCollapseDiv;

}

async function getEpisodesForSeason(season: string) {
    const allEpisodes = await getAllepisodes();
    return allEpisodes.filter(episode => episode.episode.slice(1, 3) === season.slice(-2));
}

function generateSeasonCards(episodes: any[]) {
    const display = document.querySelector('.display');
    if (!display) return;

    const fragment = document.createDocumentFragment();
    episodes.forEach(episode => {
        const episodeCard = generateEpisodeCard(episode);
        fragment.appendChild(episodeCard);
    });
    display.innerHTML = '';  // Clear previous cards
    display.appendChild(fragment);
}

function seasonSelector(episodes: any[]): { [key: string]: any[] } {
    const seasons: { [key: string]: any[] } = {};
    episodes.forEach(episode => {
        const seasonNumber = episode.episode.slice(1, 3);
        const seasonName = `season${seasonNumber}`;
        if (!seasons[seasonName]) {
            seasons[seasonName] = [];
        }
        seasons[seasonName].push(episode);
    });
    return seasons;
}

function generateEpisodeCard(episode: any): HTMLElement {
    const seasonNumber = episode.episode.slice(1, 3);
    const imagePath = `../media/seasons/season${seasonNumber}.png`;

    const card = createElement('div', ['card', 'mb-3'], { style: "max-width: 740px;" });
    const row = createElement('div', ['row', 'g-0']);

    // Image Column
    const imgCol = createElement('div', ['col-md-4']);
    const img = createElement('img', ['img-fluid', 'rounded-start'], { src: imagePath, alt: episode.name });
    imgCol.appendChild(img);

    // Content Column
    const contentCol = createElement('div', ['col-md-8']);
    const cardBody = createElement('div', ['card-body']);

    // Card Title - Episode Name
    const cardTitle = createElement('h5', ['card-title']);
    cardTitle.innerText = episode.name;
    cardBody.appendChild(cardTitle);

    // Episode Code
    const episodeCode = createElement('p', ['card-text']);
    episodeCode.innerText = episode.episode;
    cardBody.appendChild(episodeCode);

    const viewCharactersButton = document.createElement('button');
    viewCharactersButton.innerText = 'View Characters';
    viewCharactersButton.addEventListener('click', () => showPj(episode));
    // Append button to episode card
    cardBody.appendChild(viewCharactersButton);


    contentCol.appendChild(cardBody);
    row.appendChild(imgCol);
    row.appendChild(contentCol);
    card.appendChild(row);

    return card;
}



const locationButton = document.querySelector('#locations');

if (locationButton) {
    locationButton.addEventListener('click', showLocations);
}

async function showLocations() {
    const display = document.querySelector('.display')!;
    display.innerHTML = "";

    const locationsScreen = document.createElement('div');
    locationsScreen.classList.add("container");
    display.appendChild(locationsScreen);

    try {
        const locations = await getAllLocations();

        let row: HTMLDivElement;

        locations.forEach((location: any, index: number) => {
            if (index % 3 === 0) { // Start a new row every 3 locations
                row = document.createElement('div');
                row.classList.add('row');
                locationsScreen.appendChild(row);
            }

            const locationCard = document.createElement('div');
            locationCard.classList.add('col-md-4', 'text-center');

            if (location.image) {
                const locationImage = document.createElement('img');
                locationImage.src = location.image;
                locationImage.alt = location.name;
                locationImage.classList.add('img-fluid');
                locationCard.appendChild(locationImage);
            }

            const locationName = document.createElement('h2');
            locationName.innerText = location.name;
            locationCard.appendChild(locationName);

            const locationType = document.createElement('p');
            locationType.innerText = `Type: ${location.type}`;
            locationCard.appendChild(locationType);

            const locationDimension = document.createElement('p');
            locationDimension.innerText = `Dimension: ${location.dimension}`;
            locationCard.appendChild(locationDimension);

            const showResidentsButton = document.createElement('button');
            showResidentsButton.innerText = "Show Residents";
            showResidentsButton.addEventListener('click', () => showResidents(location));
            
            locationCard.appendChild(showResidentsButton);

            row.appendChild(locationCard);
        });
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}
const characterButton = document.querySelector('#characters');

if (characterButton) {
    characterButton.addEventListener('click', showAllCharacters);
}





async function createCharacterCards(characterUrls: string[], display: HTMLElement) {
    let row: HTMLDivElement = document.createElement('div');  // Initialize the row right away
    row.classList.add('row');
    display.appendChild(row);

    for (const [index, charUrl] of characterUrls.entries()) {
        if (index % 3 === 0 && index !== 0) {  // Add a check to skip creating a new row if it's the first iteration
            row = document.createElement('div');
            row.classList.add('row');
            display.appendChild(row);
        }

        const response = await fetch(charUrl);
        const characterData = await response.json();

        const characterCard = document.createElement('div');
        characterCard.classList.add('col-md-4', 'text-center');

        const characterImage = document.createElement('img');
        characterImage.src = characterData.image;
        characterImage.alt = characterData.name;
        characterImage.classList.add('img-fluid');
        characterImage.setAttribute('data-id', characterData.id.toString());
        characterImage.setAttribute('data-bs-toggle', 'modal');
        characterImage.setAttribute('data-bs-target', '#characterModal');
        characterCard.appendChild(characterImage);

        const characterName = document.createElement('h2');
        characterName.innerText = characterData.name;
        characterCard.appendChild(characterName);

        characterCard.addEventListener('click', () => handleCharacterClick(characterImage));
        
        row.appendChild(characterCard);
    }
}



async function handleCharacterClick(image: HTMLElement) {
    const charId = image.getAttribute('data-id');

    const allCharacters = await getCharacters();
    
    const characterData = allCharacters.find(
        (char: { id: number, image: string, name: string, status: string, location: { name: string }, episode: string[] }) => 
        char.id.toString() === charId
    );

    if (characterData) {
        const modalData: CharacterModalParams = {
            image: characterData.image,
            name: characterData.name,
            status: `Status: ${characterData.status}`,
            location: {
                name: `Location: ${characterData.location.name}`
            },
            episode: [`Episode: ${characterData.episode.length}`]
        };
    
        showModal(modalData);
    }
}
    
    interface CharacterModalParams {
        image: string;
        name: string;
        status: string;
        location: {
            name: string;
        };
        episode: string[];  
    }
    function showModal(character: CharacterModalParams) {
        const { image, name, status, location, episode } = character;
    
      
        const modalTitle = document.getElementById('characterModalLabel')!;
        const modalImage = document.getElementById('characterImage') as HTMLImageElement;  
        const modalDetailsList = document.getElementById('characterDetails')!;
    
      
        modalTitle.innerText = name;
        modalImage.src = image;
        modalDetailsList.innerHTML = '';
        modalDetailsList.innerHTML = `
            <li>${status}</li>
            <li>${location.name}</li>
            <li>Episodes: ${episode.length}</li>
        `;
    }

    async function showAllCharacters() {
        const display = document.querySelector('.display')!;
        display.innerHTML = "";
    
        const charactersScreen = document.createElement('div');
        charactersScreen.classList.add("container");
        display.appendChild(charactersScreen);
    
        try {
            const characters = await getAllCharacters();
            const characterUrls = characters.map(character => character.url); // Assuming each character object has a url property
            await createCharacterCards(characterUrls, charactersScreen);
        } catch (error) {
            console.error("Error fetching characters:", error);
        }
    }
    
    function showPj(episode: Episode) {
        const display = document.querySelector('.display')!;
        display.innerHTML = "";
        const episodeTitle = document.createElement('h1');
        episodeTitle.innerText = episode.name;
        display.appendChild(episodeTitle);
    
        const characterScreen = document.createElement('div');
        characterScreen.classList.add("container");
        display.appendChild(characterScreen);
    
        createCharacterCards(episode.characters, characterScreen);
    }
    
    function showResidents(location: Location) {
        const display = document.querySelector('.display')!;
        display.innerHTML = "";
        const locationTitle = document.createElement('h1');
        locationTitle.innerText = location.name;
        display.appendChild(locationTitle);
    
        const residentsScreen = document.createElement('div');
        residentsScreen.classList.add("container");
        display.appendChild(residentsScreen);
    
        createCharacterCards(location.residents, residentsScreen);
    }