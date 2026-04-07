"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
/**
 * Represents a User Role in the aramizdakioyuncu.com platform.
 */
class Role {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.color = '';
        this.permissions = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a Role object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Role({
            id: json.id || '',
            name: json.name || json.title || '',
            color: json.color || '#808080',
            permissions: json.permissions || [],
        });
    }
}
exports.Role = Role;
