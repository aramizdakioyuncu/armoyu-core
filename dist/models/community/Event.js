"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmoyuEvent = void 0;
/**
 * Represents an ARMOYU platform event (tournament, meeting, etc.)
 */
class ArmoyuEvent {
    constructor(data) {
        this.id = 0;
        this.name = '';
        this.status = 0;
        this.link = '';
        this.thumbnail = '';
        // Game details
        this.gameId = 0;
        this.gameName = '';
        this.gameLogo = '';
        this.gameBanner = '';
        // Organizer details
        this.organizers = [];
        // Event specifics
        this.type = ''; // e.g. 'bireysel', 'gruplu'
        this.date = ''; // Format: DD.MM.YYYY HH:mm
        this.participantType = ''; // e.g. 'herkes'
        this.participantLimit = 0;
        this.groupPlayerLimit = 0;
        this.currentParticipants = 0;
        this.location = '';
        this.description = '';
        this.rules = '';
        Object.assign(this, data);
    }
    /**
     * Instantiates an ArmoyuEvent object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        // Map organizer list
        const organizers = (json.event_organizer || []).map((o) => ({
            id: Number(o.player_ID || 0),
            displayName: o.player_displayname || '',
            avatar: o.player_avatar || ''
        }));
        return new ArmoyuEvent({
            id: Number(json.event_ID || json.id || 0),
            name: json.event_name || json.title || '',
            status: Number(json.event_status || 0),
            link: json.event_link || '',
            thumbnail: json.event_foto || json.banner || '',
            image: json.event_fotodetail || undefined,
            gameId: Number(json.event_gameID || 0),
            gameName: json.event_gamename || json.game || '',
            gameLogo: json.event_gamelogo || '',
            gameBanner: json.event_gamebanner || '',
            organizers: organizers,
            type: json.event_type || '',
            date: json.event_date || json.date || '',
            participantType: json.event_participanttype || '',
            participantLimit: Number(json.event_participantlimit || 0),
            groupPlayerLimit: Number(json.event_participantgroupplayerlimit || 0),
            currentParticipants: Number(json.event_participantcurrent || 0),
            location: json.event_location || json.location || '',
            description: json.event_description || json.description || '',
            rules: json.event_rules || ''
        });
    }
    /**
     * Checks if the event has space for more participants.
     */
    hasSpace() {
        return this.participantLimit === 0 || this.currentParticipants < this.participantLimit;
    }
    /**
     * Returns a formatted progress string for participants (e.g. "12/16").
     */
    getParticipantProgress() {
        const limit = this.participantLimit === 0 ? "∞" : this.participantLimit;
        return `${this.currentParticipants}/${limit}`;
    }
}
exports.ArmoyuEvent = ArmoyuEvent;
