"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mod = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Game Mod (Oyun Modu) in the aramizdakioyuncu.com platform.
 */
class Mod {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.game = '';
        this.version = '';
        this.author = null;
        this.description = '';
        this.downloads = '';
        this.image = '';
        this.isFeatured = false;
        Object.assign(this, data);
    }
    /**
     * Instantiates a Mod object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Mod({
            id: json.id || '',
            name: json.name || json.title || '',
            game: json.game || '',
            version: json.version || '',
            author: json.author ? (json.author instanceof User_1.User ? json.author : User_1.User.fromJSON(json.author)) : (json.authorUsername ? new User_1.User({ username: json.authorUsername, displayName: json.authorName }) : null),
            description: json.description || json.desc || '',
            downloads: json.downloads || '0',
            image: json.image || '',
            isFeatured: json.isFeatured || false,
        });
    }
}
exports.Mod = Mod;
