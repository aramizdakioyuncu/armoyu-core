"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicket = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Support Ticket in the armoyu platform.
 */
class SupportTicket {
    constructor(data) {
        this.id = '';
        this.subject = '';
        this.category = 'Genel'; // Şikayet, Öneri, Bildiri
        this.status = 'Açık'; // Açık, Cevaplandı, Kapandı
        this.priority = 'Normal'; // Düşük, Normal, Yüksek
        this.createdAt = '';
        this.updatedAt = '';
        this.lastMessage = '';
        Object.assign(this, data);
    }
    /**
     * Instantiates a SupportTicket object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new SupportTicket({
            id: json.id || '',
            subject: json.subject || '',
            category: json.category || 'Genel',
            status: json.status || 'Açık',
            priority: json.priority || 'Normal',
            createdAt: json.createdAt || json.created_at || '',
            updatedAt: json.updatedAt || json.updated_at || '',
            lastMessage: json.lastMessage || json.last_message || '',
            author: json.author ? User_1.User.fromJSON(json.author) : undefined,
        });
    }
}
exports.SupportTicket = SupportTicket;
