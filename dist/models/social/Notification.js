"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const Group_1 = require("../community/Group");
const NotificationSender_1 = require("./NotificationSender");
const NotificationEnums_1 = require("./NotificationEnums");
/**
 * Represents a Notification in the aramizdakioyuncu.com platform.
 */
class Notification {
    // event?: Event; // Add when Event is ready
    constructor(data) {
        var _a;
        this.id = '';
        this.type = 'SYSTEM_ALERT';
        this.category = NotificationEnums_1.NotificationCategory.SYSTEM;
        this.title = '';
        this.message = '';
        this.context = ''; // Detailed context (snippet of comment, etc)
        this.link = '';
        this.isRead = false;
        this.isClickable = true; // New property
        this.createdAt = '';
        Object.assign(this, data);
        // 1. Sync from Post object if exists
        if (this.post) {
            this.postId = this.post.id;
            if (!this.context) {
                // Create context snippet from post content
                this.context = this.post.content.length > 50
                    ? this.post.content.substring(0, 47) + '...'
                    : this.post.content;
            }
        }
        // 2. Auto-generate link from objects (OO)
        if (!this.link) {
            if (this.group) {
                this.link = this.group.getGroupUrl();
            }
            else if (this.groupId) {
                // Fallback for ID strings
                const targetSlug = this.groupId.toLowerCase().replace(/\s+/g, '-');
                this.link = `/gruplar/${targetSlug}`;
            }
            else if (this.postId) {
                this.link = `/?post=${this.postId}`;
            }
            else if ((_a = this.sender) === null || _a === void 0 ? void 0 : _a.url) {
                this.link = this.sender.url;
            }
        }
        // 3. Sync title/metadata if missing but object exists
        if (!this.title && this.group && this.type === 'GROUP_INVITE') {
            this.title = 'Grup Daveti';
            this.message = `${this.group.name} grubuna davet edildin.`;
        }
        // Default to system sender if not provided for system notifications
        if (this.category === NotificationEnums_1.NotificationCategory.SYSTEM) {
            if (!this.sender)
                this.sender = NotificationSender_1.NotificationSender.system();
            this.isClickable = false;
            this.link = ''; // System messages shouldn't have links usually
        }
    }
    /**
     * Instantiates a Notification object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Notification({
            id: json.id || '',
            type: json.type || 'SYSTEM_ALERT',
            category: json.category || NotificationEnums_1.NotificationCategory.SYSTEM,
            title: json.title || '',
            message: json.message || '',
            context: json.context || '',
            sender: json.sender ? new NotificationSender_1.NotificationSender(json.sender) : undefined,
            link: json.link || '',
            isRead: json.isRead || false,
            createdAt: json.createdAt || json.created_at || '',
            postId: json.postId || json.post_id,
            commentId: json.commentId || json.comment_id,
            eventId: json.eventId || json.event_id,
            groupId: json.groupId || json.group_id,
            group: json.group ? Group_1.Group.fromJSON(json.group) : undefined,
        });
    }
}
exports.Notification = Notification;
