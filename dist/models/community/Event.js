"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmoyuEvent = void 0;
class ArmoyuEvent {
    constructor(data) {
        this.id = '';
        this.title = '';
        this.status = '';
        this.banner = '';
        this.date = '';
        this.location = '';
        this.participantLimit = 0;
        this.currentParticipants = 0;
        this.description = '';
        this.rules = [];
        this.admins = [];
        this.game = '';
        this.rewards = '';
        this.isHot = false;
        this.isLive = false;
        this.participants = []; // Array of participant objects/userslf
        this.participationType = 'INDIVIDUAL';
        this.minODP = 0; // Minimum score required to join
        this.hasStats = false; // Whether to show statistics tab
        this.template = 'STANDARD';
        this.teams = []; // List of teams for tournament template
        this.leaderboard = []; // List of top performers
        Object.assign(this, data);
    }
    static fromJSON(json) {
        return new ArmoyuEvent(json);
    }
}
exports.ArmoyuEvent = ArmoyuEvent;
