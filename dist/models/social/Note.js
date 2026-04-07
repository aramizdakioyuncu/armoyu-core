"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a "Note" (Instagram-style status bubble) in the aramizdakioyuncu.com platform.
 */
class Note {
    constructor(data) {
        this.id = '';
        this.user = null;
        this.note = '';
        this.isMe = false;
        Object.assign(this, data);
    }
    /**
     * Instantiates a Note object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Note({
            id: json.id || '',
            user: json.user ? User_1.User.fromJSON(json.user) : null,
            note: json.note || '',
            isMe: json.isMe || false,
        });
    }
}
exports.Note = Note;
