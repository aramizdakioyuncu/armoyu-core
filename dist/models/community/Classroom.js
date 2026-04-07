"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Classroom (Sınıf) in the ARMOYU education ecosystem.
 */
class Classroom {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.password = '';
        this.schoolId = '';
        this.members = [];
        this.teacher = null;
        this.memberCount = 0;
        Object.assign(this, data);
    }
    /**
     * Instantiates a Classroom object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Classroom({
            id: json.id || '',
            name: json.name || '',
            password: json.password || '',
            schoolId: json.schoolId || '',
            members: Array.isArray(json.members) ? json.members.map(User_1.User.fromJSON) : [],
            teacher: json.teacher ? User_1.User.fromJSON(json.teacher) : null,
            memberCount: json.memberCount || 0
        });
    }
}
exports.Classroom = Classroom;
