var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getEpisodes } from './utils/API.js';
window.addEventListener("load", init);
function seasonSelector(episodes) {
    let seasons = {};
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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodes = yield getEpisodes();
        const seasons = seasonSelector(episodes);
        console.log(seasons);
    });
}
