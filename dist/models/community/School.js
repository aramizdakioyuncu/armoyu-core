"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const User_1 = require("../auth/User");
const Faculty_1 = require("./Faculty");
const Classroom_1 = require("./Classroom");
const SchoolTeam_1 = require("./SchoolTeam");
/**
 * Represents a School (Okul/Üniversite) in the ARMOYU education ecosystem.
 */
class School {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.slug = '';
        this.logo = '';
        this.background = '';
        this.description = '';
        this.representative = null;
        this.faculties = [];
        this.teams = [];
        this.classrooms = [];
        this.joinPassword = '';
        this.isSocialFeedEnabled = true;
        this.memberCount = 0;
        Object.assign(this, data);
    }
    /**
     * Instantiates a School object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new School({
            id: json.id || '',
            name: json.name || '',
            slug: json.slug || '',
            logo: json.logo || '',
            background: json.background || '',
            description: json.description || '',
            representative: json.representative ? User_1.User.fromJSON(json.representative) : null,
            faculties: Array.isArray(json.faculties) ? json.faculties.map(Faculty_1.Faculty.fromJSON) : [],
            teams: Array.isArray(json.teams) ? json.teams.map(SchoolTeam_1.SchoolTeam.fromJSON) : [],
            classrooms: Array.isArray(json.classrooms) ? json.classrooms.map(Classroom_1.Classroom.fromJSON) : [],
            joinPassword: json.joinPassword || '',
            isSocialFeedEnabled: json.isSocialFeedEnabled !== undefined ? json.isSocialFeedEnabled : true,
            memberCount: json.memberCount || 0
        });
    }
}
exports.School = School;
