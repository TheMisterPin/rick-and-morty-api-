var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = 'https://rickandmortyapi.com/api';
const urlEpisodes = `${url}/episode`;
const urlLocations = `${url}/location`;
const urlCharacters = `${url}/character`;
export function getEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(urlEpisodes);
        const data = yield response.json();
        return data.results;
    });
}
export function getLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(urlLocations);
        const data = yield response.json();
        return data.results;
    });
}
export function getCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(urlCharacters);
        const data = yield response.json();
        return data.results;
    });
}
