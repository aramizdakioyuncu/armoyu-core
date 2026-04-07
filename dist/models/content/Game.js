"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
/**
 * Represents a Game in the aramizdakioyuncu.com platform.
 */
class Game {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.slug = '';
        this.logo = '';
        this.poster = '';
        this.category = '';
        this.developer = '';
        this.description = '';
        Object.assign(this, data);
        if (!this.slug && this.name) {
            this.slug = this.name.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
        }
    }
    /**
     * Instantiates a Game object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Game({
            id: json.id || '',
            name: json.name || '',
            slug: json.slug || '',
            logo: json.logo || json.logo_url || '',
            poster: json.poster || json.poster_url || '',
            category: json.category || '',
            developer: json.developer || '',
            description: json.description || '',
        });
    }
}
exports.Game = Game;
