"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
/**
 * Represents a Giveaway (Çekiliş) in the aramizdakioyuncu.com platform.
 */
class Giveaway {
    constructor(data) {
        this.id = '';
        this.title = '';
        this.prize = '';
        this.status = 'active';
        this.participants = 0;
        this.timeLeft = '';
        this.image = '';
        Object.assign(this, data);
    }
    /**
     * Returns true if the giveaway is currently active.
     */
    isActive() {
        return this.status === 'active';
    }
    /**
     * Instantiates a Giveaway object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Giveaway({
            id: json.id || '',
            title: json.title || '',
            prize: json.prize || '',
            status: json.status || 'active',
            participants: json.participants || 0,
            timeLeft: json.timeLeft || json.time_left || '',
            image: json.image || '',
        });
    }
}
exports.Giveaway = Giveaway;
