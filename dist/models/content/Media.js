"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
/**
 * Represents a Media item (Fotoğraf/Video) in the aramizdakioyuncu.com platform.
 */
class Media {
    constructor(data) {
        this.title = '';
        this.count = 0;
        this.author = '';
        this.date = '';
        this.category = '';
        this.image = '';
        Object.assign(this, data);
    }
    /**
     * Instantiates a Media object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Media({
            title: json.title || '',
            count: json.count || 0,
            author: json.author || '',
            date: json.date || '',
            category: json.category || '',
            image: json.image || json.thumb || '',
        });
    }
}
exports.Media = Media;
