"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSender = void 0;
/**
 * Interface representing a standardized sender for notifications.
 */
class NotificationSender {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.avatar = '';
        this.type = 'SYSTEM';
        Object.assign(this, data);
    }
    /**
     * Helper to create a system sender.
     */
    static system() {
        return new NotificationSender({
            id: 'system',
            name: 'ARMOYU',
            avatar: 'https://armoyu.com/assets/img/armoyu_logo.png',
            type: 'SYSTEM'
        });
    }
}
exports.NotificationSender = NotificationSender;
