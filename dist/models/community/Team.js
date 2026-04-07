"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
class Team {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.logo = '';
        this.primaryColor = '';
        this.shortName = '';
        Object.assign(this, data);
    }
    static fromJSON(json) {
        return new Team({
            id: json.id || '',
            name: json.name || '',
            logo: json.logo || '',
            primaryColor: json.primaryColor || '#1d4ed8',
            shortName: json.shortName || ''
        });
    }
}
exports.Team = Team;
