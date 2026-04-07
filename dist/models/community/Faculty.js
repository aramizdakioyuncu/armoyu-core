"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Faculty (Fakülte) within a School.
 */
class Faculty {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.schoolId = '';
        this.representative = null;
        this.memberCount = 0;
        Object.assign(this, data);
    }
    /**
     * Instantiates a Faculty object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Faculty({
            id: json.id || '',
            name: json.name || '',
            schoolId: json.schoolId || '',
            representative: json.representative ? User_1.User.fromJSON(json.representative) : null,
            memberCount: json.memberCount || 0
        });
    }
}
exports.Faculty = Faculty;
