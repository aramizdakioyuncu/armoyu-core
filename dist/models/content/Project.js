"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const User_1 = require("../auth/User");
const Group_1 = require("../community/Group");
/**
 * Represents a Project in the aramizdakioyuncu.com platform.
 */
class Project {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.description = '';
        this.status = '';
        this.image = '';
        this.url = '';
        this.githubUrl = '';
        this.authors = [];
        this.group = null;
        this.techStack = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a Project object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Project({
            id: json.id || '',
            name: json.name || json.title || '',
            description: json.description || '',
            status: json.status || '',
            image: json.image || json.thumb || '',
            url: json.url || json.demoUrl || '',
            githubUrl: json.githubUrl || json.github || '',
            authors: Array.isArray(json.authors) ? json.authors.map((a) => ({
                user: a.user instanceof User_1.User ? a.user : User_1.User.fromJSON(a.user || a),
                role: a.role || 'Geliştirici'
            })) : [],
            group: json.group ? (json.group instanceof Group_1.Group ? json.group : Group_1.Group.fromJSON(json.group)) : null,
            techStack: Array.isArray(json.techStack) ? json.techStack : [],
        });
    }
}
exports.Project = Project;
