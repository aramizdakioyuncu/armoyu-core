"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolTeam = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a School Team (Okul Takımı) for specific games or sports.
 */
class SchoolTeam {
    constructor(data) {
        this.id = '';
        this.name = ''; // e.g., "UAV FB", "ARMOYU CS2"
        this.gameOrSport = ''; // e.g., "Football", "Volleyball", "Counter-Strike 2"
        this.type = 'ESPORTS';
        this.logo = '';
        this.schoolId = '';
        this.captain = null;
        this.coach = null;
        this.members = [];
        this.memberCount = 0;
        this.achievements = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a SchoolTeam object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new SchoolTeam({
            id: json.id || '',
            name: json.name || '',
            gameOrSport: json.gameOrSport || json.game_or_sport || '',
            type: json.type || 'ESPORTS',
            logo: json.logo || '',
            schoolId: json.schoolId || '',
            captain: json.captain ? User_1.User.fromJSON(json.captain) : null,
            coach: json.coach ? User_1.User.fromJSON(json.coach) : null,
            members: Array.isArray(json.members) ? json.members.map(User_1.User.fromJSON) : [],
            memberCount: json.memberCount || 0,
            achievements: json.achievements || []
        });
    }
}
exports.SchoolTeam = SchoolTeam;
