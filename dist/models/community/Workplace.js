"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workplace = void 0;
/**
 * Represents a Workplace (İşyeri/Ofis) in the aramizdakioyuncu.com platform.
 */
class Workplace {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.description = '';
        this.location = '';
        this.logo = '';
        this.website = '';
        this.establishedDate = '';
        Object.assign(this, data);
    }
    /**
     * Instantiates a Workplace object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Workplace({
            id: json.id || '',
            name: json.name || json.title || '',
            description: json.description || '',
            location: json.location || json.address || '',
            logo: json.logo || json.logo_url || '',
            website: json.website || '',
            establishedDate: json.establishedDate || json.created_at || '',
        });
    }
}
exports.Workplace = Workplace;
