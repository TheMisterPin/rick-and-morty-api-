import { getAllepisodes } from './utils/API.js';
import { Episode } from './types/Episodes';
import { Character } from './types/Character';

interface Attributes {
    [key: string]: string;
}


window.addEventListener("DOMContentLoaded", (event) => {
    setTimeout(() => {
        const introElement = document.getElementById('intro');
        if (introElement) {
            introElement.style.display = 'none';
        }
    }, 9500);  // Hide after 9.5 seconds
});


window.addEventListener("load", init);


function init(): void {
    generateLayout().then(() => {
        generateAccordion().then(() => {
            getAllepisodes().then(episodes => {
                const season1Episodes = episodes.filter(episode => episode.episode.startsWith("S01"));
                episodeClicked("season01", season1Episodes);
            });
        });
    })
}

function generateSidebar(): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve) => {
        const asideElement = createElement('aside', ['sidebar']);
        const accordionDiv = createElement('div', ['accordionContainer', 'accordion']);
        asideElement.appendChild(accordionDiv);
        resolve(asideElement);
    });
}

function generateDisplay(): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve) => {
        const display = createElement('output', ['display']);
        display.innerHTML = '';   
        resolve(display);
    });
}

function generateLayout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const layoutDiv = createElement('div', ['layout']);

        generateSidebar().then(asideElement => {
            layoutDiv.appendChild(asideElement); 
            
            generateDisplay().then(displayElement => {
                layoutDiv.appendChild(displayElement); 
                
                document.body.appendChild(layoutDiv);
                resolve();
            }).catch(err => {
                console.error('Error generating the display section:', err);
                reject(err);
            });
        }).catch(err => {
            console.error('Error generating the sidebar:', err);
            reject(err);
        });
    });
}

function createElement(tag: string, classes: string[] = [], attributes: Attributes = {}): HTMLElement {
    const elem = document.createElement(tag);
    if (classes.length) {
        elem.classList.add(...classes);
    }
    Object.entries(attributes).forEach(([key, value]) => {
        elem.setAttribute(key, value);
    });
    return elem;
}

function generateAccordionHeader(season: string): HTMLElement {
    const seasonHeader = createElement('h2', ['accordion-header'], { id: `heading${season}` });
    const seasonButton = createElement('button', ['accordion-button', 'collapsed'], {
        'type': 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': `#collapse${season}`
    });
    seasonButton.innerText = season.charAt(0).toUpperCase() + season.slice(1);
    seasonHeader.appendChild(seasonButton);
    return seasonHeader;
}

function generateAccordionBody(season: string, episodes: Episode[]): HTMLElement {
    const seasonCollapseDiv = createElement('div', ['accordion-collapse', 'collapse'], {
        id: `collapse${season}`,
        'aria-labelledby': `heading${season}`,
        'data-bs-parent': ".accordion"
    });

    const episodesDiv = createElement('div', ['d-flex', 'flex-column', 'gap-2', 'simple-list-example-scrollspy', 'text-center', 'parent'], {
    
       
    });
    
    episodes.forEach(episode => {
        const episodeDiv = createElement('a', ['episode-item', 'list-group-item', 'list-group-item-action'], { href: `#${episode.id}` });
        episodeDiv.innerText = episode.name;
        episodeDiv.setAttribute('data-id', episode.id.toString());
        episodeDiv.addEventListener('click', () => episodeClicked(season, episodes));
        episodesDiv.appendChild(episodeDiv);
    });

    seasonCollapseDiv.appendChild(episodesDiv);
    return seasonCollapseDiv;
}

function episodeClicked(season: string, episodes: Episode[]): void {
    const display = document.querySelector(".display");
    if (display) {
        display.innerHTML = '';

       
        document.querySelectorAll('.episode-item').forEach(item => {
            item.classList.remove('active-episode');
        });
        const clickedItem = document.querySelector(`#${season}Episodes .episode-item[data-id="${episodes[0].id}"]`);
        if (clickedItem) clickedItem.classList.add('active-episode');

        episodes.forEach(episode => {
            const episodeCard = generateEpisodeCard(episode);
            display.appendChild(episodeCard);
        });
    } else {
        console.error('Display element not found!');
    }
}


function seasonSelector(episodes: Episode[]): { [key: string]: Episode[] } {
    const seasons: { [key: string]: Episode[] } = {};
    for (const episode of episodes) {
        const seasonNumber = episode.episode.slice(1, 3); 
        const seasonName = `season${seasonNumber}`;
        if (!seasons[seasonName]) {
            seasons[seasonName] = [];
        }
        seasons[seasonName].push(episode);
    }
    return seasons;
}

async function generateAccordion(): Promise<void> {
    const accordionContainer = document.querySelector('.accordionContainer');
    if (accordionContainer) {
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
    } else {
        console.error('Accordion container not found. Ensure that the sidebar is created first.');
    }
}

function generateEpisodeCard(episode: Episode): HTMLElement {
    
    const seasonNumber = episode.episode.slice(1, 3); 
    const imagePath = SeasonImage(seasonNumber);
    
    const card = createElement('div', ['card', 'mb-3'], { style: "max-width: 540px;" });

    const row = createElement('div', ['row', 'g-0']);

    
    const imgCol = createElement('div', ['col-md-4']);
    const img = createElement('img', ['img-fluid', 'rounded-start'], { src: imagePath, alt: episode.name });
    imgCol.appendChild(img);

 
    const contentCol = createElement('div', ['col-md-8']);
    const cardBody = createElement('div', ['card-body']);
    const cardTitle = createElement('h5', ['card-title']);
    cardTitle.innerText = episode.name;
    const cardTextSmall = createElement('p', ['card-text']);
    const smallText = createElement('small', ['text-body-secondary']);
    smallText.innerText = `Aired on ${episode.air_date}`;
    cardTextSmall.appendChild(smallText);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTextSmall);
    contentCol.appendChild(cardBody);

 
    row.appendChild(imgCol);
    row.appendChild(contentCol);

   
    card.appendChild(row);

    return card;
}






function SeasonImage(seasonNumber: string): string {
    return `../media/seasons/season${seasonNumber}.png`;
}