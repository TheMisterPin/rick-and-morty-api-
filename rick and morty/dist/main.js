import { getAllepisodes, getAllCharacters, getAllLocations } from './utils/API.js';
import { getCharacterById } from './utils/API.js';
document.addEventListener("DOMContentLoaded", () => { init(); });
function init() {
    console.log("Init function called");
    generateLayout();
    generateAccordion();
}
function generateLayout() {
    document.body.appendChild(generateSidebar());
    document.body.appendChild(generateDisplay());
}
function generateSidebar() {
    const asideElement = document.querySelector(".sidebar");
    const accordionDiv = createElement('div', ['accordionContainer', 'accordion']);
    asideElement.appendChild(accordionDiv);
    return asideElement;
}
function generateDisplay() {
    const display = createElement('output', ['display']);
    display.innerHTML = '';
    return display;
}
function createElement(tag, classes = [], attributes = {}) {
    const elem = document.createElement(tag);
    elem.classList.add(...classes);
    for (const key in attributes) {
        elem.setAttribute(key, attributes[key]);
    }
    return elem;
}
async function generateAccordion() {
    const accordionContainer = document.querySelector('.accordionContainer');
    if (!accordionContainer)
        return;
    const episodes = await getAllepisodes();
    const categorizedSeasons = seasonSelector(episodes);
    for (const season in categorizedSeasons) {
        const seasonDiv = createElement('div', ['accordion-item', 'episode']);
        const seasonHeader = generateAccordionHeader(season);
        seasonDiv.appendChild(seasonHeader);
        const seasonBody = generateAccordionBody(season, categorizedSeasons[season]);
        seasonDiv.appendChild(seasonBody);
        accordionContainer.appendChild(seasonDiv);
    }
}
function formatSeasonString(season) {
    const match = season.match(/\d+/);
    if (!match) {
        throw new Error(`Failed to extract a number from the season string: ${season}`);
    }
    const seasonNumber = match[0];
    return `Season ${seasonNumber}`;
}
function generateAccordionHeader(season) {
    const seasonHeader = createElement('h2', ['season-header', 'accordion-header'], { id: `heading${season}` });
    const seasonButton = createElement('button', ['accordion-button', 'collapsed', 'season-button'], {
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
function generateAccordionBody(season, episodes) {
    const seasonCollapseDiv = createElement('div', ['accordion-collapse', 'collapse'], {
        id: `collapse${season}`,
        'aria-labelledby': `heading${season}`,
        'data-bs-parent': ".accordion"
    });
    const episodesDiv = createElement('ul', ['d-flex', 'flex-column', 'simple-list-example-scrollspy', 'text-center', 'episode-list']);
    episodes.forEach(episode => {
        const episodeDiv = createElement('li', ['href="#simple-list-item-1']);
        const episodeLink = createElement('a', ['episode-item', 'p-1', 'rounded'], { href: `#${episode.id}` });
        episodeLink.innerText = episode.name;
        episodeLink.setAttribute('data-id', episode.id.toString());
        episodeDiv.appendChild(episodeLink);
        episodesDiv.appendChild(episodeDiv);
    });
    seasonCollapseDiv.appendChild(episodesDiv);
    return seasonCollapseDiv;
}
async function getEpisodesForSeason(season) {
    const allEpisodes = await getAllepisodes();
    return allEpisodes.filter(episode => episode.episode.slice(1, 3) === season.slice(-2));
}
function generateSeasonCards(episodes) {
    var _a, _b;
    const display = document.querySelector('.display');
    if (!display)
        return;
    const seasonTitle = document.createElement('h1');
    seasonTitle.classList.add('screen-header');
    seasonTitle.innerText = `Season ${(_b = (_a = episodes[0]) === null || _a === void 0 ? void 0 : _a.episode) === null || _b === void 0 ? void 0 : _b.slice(1, 3)}`;
    const fragment = document.createDocumentFragment();
    episodes.forEach(episode => {
        const episodeCard = generateEpisodeCard(episode);
        fragment.appendChild(episodeCard);
    });
    display.innerHTML = '';
    display.appendChild(seasonTitle);
    display.appendChild(fragment);
}
function seasonSelector(episodes) {
    const seasons = {};
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
function generateEpisodeCard(episode) {
    const seasonNumber = episode.episode.slice(1, 3);
    const imagePath = `../media/seasons/season${seasonNumber}.png`;
    const card = createElement('div', ['card', 'text-center', 'episode-card'], { id: episode.id.toString() });
    const row = createElement('div', ['row', 'g-0', 'justify-content-center']);
    const imgCol = createElement('div', ['col-md-4']);
    const img = createElement('img', ['img-fluid', 'rounded-start', 'episode-img'], { src: imagePath, alt: episode.name });
    imgCol.appendChild(img);
    const contentCol = createElement('div', ['col-md-8']);
    const cardBody = createElement('div', ['card-info']);
    const cardTitle = createElement('h5', ['card-title', 'episode-title']);
    cardTitle.innerText = episode.name;
    cardBody.appendChild(cardTitle);
    const episodeCode = createElement('p', ['card-text', 'episode-text']);
    episodeCode.innerText = episode.episode;
    cardBody.appendChild(episodeCode);
    const viewCharactersButton = document.createElement('button');
    viewCharactersButton.classList.add('episode-btn');
    viewCharactersButton.innerText = 'View Characters';
    viewCharactersButton.addEventListener('click', () => showCharacters(episode));
    contentCol.appendChild(cardBody);
    row.appendChild(imgCol);
    row.appendChild(contentCol);
    card.appendChild(row);
    row.appendChild(viewCharactersButton);
    return card;
}
const locationButton = document.querySelector('#locations');
const characterButton = document.querySelector('#characters');
if (locationButton) {
    locationButton.addEventListener('click', showLocations);
}
if (characterButton) {
    characterButton.addEventListener('click', showAllCharacters);
}
async function showLocations() {
    const display = document.querySelector('.display');
    display.innerHTML = "";
    const locationsScreen = document.createElement('section');
    locationsScreen.classList.add('container', 'location-screen');
    display.appendChild(locationsScreen);
    try {
        const locations = await getAllLocations();
        let row;
        locations.forEach((location, index) => {
            if (index % 2 === 0) { // Start a new row every 3 locations
                row = document.createElement('div');
                row.classList.add('row');
                locationsScreen.appendChild(row);
            }
            const locationCard = document.createElement('div');
            locationCard.setAttribute('data-id', location.id.toString());
            locationCard.classList.add('col-md-4', 'text-center', 'location-card');
            const locationName = document.createElement('h2');
            locationName.innerText = location.name;
            locationName.classList.add('location-name');
            locationCard.appendChild(locationName);
            const locationType = document.createElement('p');
            locationType.classList.add('location-type');
            locationType.innerText = `Type: ${location.type}`;
            locationCard.appendChild(locationType);
            const locationDimension = document.createElement('p');
            locationDimension.classList.add('location-type');
            locationDimension.innerText = `Dimension: ${location.dimension}`;
            locationCard.appendChild(locationDimension);
            const showResidentsButton = document.createElement('button');
            showResidentsButton.innerText = "Show Residents";
            showResidentsButton.classList.add('resident-button');
            showResidentsButton.addEventListener('click', () => showResidents(location));
            locationCard.appendChild(showResidentsButton);
            row.appendChild(locationCard);
        });
    }
    catch (error) {
        console.error("Error fetching locations:", error);
    }
}
async function generateAllCharacterCards(characterUrls, display) {
    let seasonScreen = document.createElement('div');
    seasonScreen.classList.add('season-screen');
    display.appendChild(seasonScreen);
    let row = document.createElement('div');
    seasonScreen.appendChild(row);
    for (const [index, charUrl] of characterUrls.entries()) {
        const response = await fetch(charUrl);
        const characterData = await response.json();
        const characterCard = document.createElement('div');
        characterCard.classList.add('col-md-4', 'text-center', 'character-card');
        const characterImage = document.createElement('img');
        characterImage.src = characterData.image;
        characterImage.alt = characterData.name;
        characterImage.classList.add('img-fluid', 'character-image');
        characterImage.setAttribute('data-id', characterData.id.toString());
        characterImage.setAttribute('data-bs-toggle', 'modal');
        characterImage.setAttribute('data-bs-target', '#characterModal');
        characterCard.appendChild(characterImage);
        const characterName = document.createElement('h2');
        characterName.classList.add('character-name');
        characterName.innerText = characterData.name;
        characterCard.appendChild(characterName);
        characterCard.addEventListener('click', () => CharacterClick(characterImage));
        if (index % 2 === 0 && index !== 0) {
            row = document.createElement('div');
            row.classList.add('row');
            row.appendChild(characterCard);
            seasonScreen.appendChild(row);
        }
        // Add the character card to the current row
    }
}
async function CharacterClick(image) {
    const charId = parseInt(image.getAttribute('data-id') || "0");
    const characterData = await getCharacterById(charId);
    if (characterData) {
        showModal(characterData);
    }
}
function showModal(character) {
    const { image, name, status, species, type, gender, origin, location, episode } = character;
    const modalTitle = document.getElementById('characterModalLabel');
    const modalImage = document.getElementById('characterImage');
    const modalDetailsList = document.getElementById('characterDetails');
    modalTitle.innerText = name;
    modalImage.src = image;
    modalDetailsList.innerHTML = `
        <li>${status}</li>
        <li>Species: ${species}</li>
        <li>Gender: ${gender}</li>
        <li>Origin: ${origin.name}</li>
        <li>Location: ${location.name}</li>
    

    `;
}
async function showAllCharacters() {
    const display = document.querySelector('.display');
    display.innerHTML = "";
    const charactersScreen = document.createElement('div');
    charactersScreen.classList.add("character-screen");
    display.appendChild(charactersScreen);
    try {
        const characters = await getAllCharacters();
        const characterUrls = characters.map(character => character.url); // Assuming each character object has a url property
        await generateAllCharacterCards(characterUrls, charactersScreen);
    }
    catch (error) {
        console.error("Error fetching characters:", error);
    }
}
function showCharacters(episode) {
    const display = document.querySelector('.display');
    display.innerHTML = "";
    const episodeTitle = document.createElement('h1');
    episodeTitle.classList.add('character-header');
    episodeTitle.innerText = episode.name;
    display.appendChild(episodeTitle);
    const characterScreen = document.createElement('section');
    characterScreen.classList.add("character-screen");
    display.appendChild(characterScreen);
    generateAllCharacterCards(episode.characters, characterScreen);
}
function showResidents(location) {
    const display = document.querySelector('.display');
    display.innerHTML = "";
    const locationTitle = document.createElement('h1');
    locationTitle.classList.add('location-header');
    locationTitle.innerText = location.name;
    display.appendChild(locationTitle);
    const residentsScreen = document.createElement('section');
    residentsScreen.classList.add("residents-screen");
    display.appendChild(residentsScreen);
    generateAllCharacterCards(location.residents, residentsScreen);
}
