import { Episode } from './types/Episodes';
import { Character } from './types/Character';
import { Location } from './types/Location';
import { getEpisodes } from './utils/API.js';
import { getCharacters } from './utils/API.js';
import { getLocations } from './utils/API.js';


window.addEventListener("load",init);

function seasonSelector(episodes: Episode[]): { [key: string]: Episode[] } {
    let seasons: { [key: string]: Episode[] } = {};

    for (let episode of episodes) {
        // Extract season number from episode field
        let seasonNumber = episode.episode.slice(1, 3);

        if (!seasons[seasonNumber]) {
            seasons[seasonNumber] = [];
        }

        seasons[seasonNumber].push(episode);
    }

    return seasons;
}
async function init() { 

    const episodes = await getEpisodes();

    const seasons = seasonSelector(episodes);

    console.log(seasons);
}

