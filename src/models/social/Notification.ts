import { User } from '../auth/User';
import { Group } from '../community/Group';
import { Post } from './Post';
import { NotificationSender } from './NotificationSender';
import { NotificationType, NotificationCategory } from './NotificationEnums';

/**
 * Represents a Notification in the aramizdakioyuncu.com platform.
 */
export class Notification {
  id: string = '';
  type: NotificationType = 'SYSTEM_ALERT';
  category: NotificationCategory = NotificationCategory.SYSTEM;
  title: string = '';
  message: string = '';
  context: string = ''; // Detailed context (snippet of comment, etc)
  sender?: NotificationSender;
  link: string = '';
  isRead: boolean = false;
  isClickable: boolean = true; // New property
  createdAt: string = '';

  // Direct Associated IDs (Legacy supporting)
  postId?: string;
  commentId?: string;
  eventId?: string;
  groupId?: string;

  // Rich Objects (OO approach)
  group?: Group;
  post?: Post;
  // event?: Event; // Add when Event is ready

  constructor(data: Partial<Notification>) {
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
      } else if (this.groupId) {
        // Fallback for ID strings
        const targetSlug = this.groupId.toLowerCase().replace(/\s+/g, '-');
        this.link = `/gruplar/${targetSlug}`;
      } else if (this.postId) {
        this.link = `/?post=${this.postId}`; 
      } else if (this.sender?.url) {
        this.link = this.sender.url;
      }
    }

    // 3. Sync title/metadata if missing but object exists
    if (!this.title && this.group && this.type === 'GROUP_INVITE') {
      this.title = 'Grup Daveti';
      this.message = `${this.group.name} grubuna davet edildin.`;
    }

    // Default to system sender if not provided for system notifications
    if (this.category === NotificationCategory.SYSTEM) {
      if (!this.sender) this.sender = NotificationSender.system();
      this.isClickable = false;
      this.link = ''; // System messages shouldn't have links usually
    }
  }

  /**
   * Instantiates a Notification object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Notification {
    return new Notification({
      id: json.id || '',
      type: json.type || 'SYSTEM_ALERT',
      category: json.category || NotificationCategory.SYSTEM,
      title: json.title || '',
      message: json.message || '',
      context: json.context || '',
      sender: json.sender ? new NotificationSender(json.sender) : undefined,
      link: json.link || '',
      isRead: json.isRead || false,
      createdAt: json.createdAt || json.created_at || '',
      postId: json.postId || json.post_id,
      commentId: json.commentId || json.comment_id,
      eventId: json.eventId || json.event_id,
      groupId: json.groupId || json.group_id,
      group: json.group ? Group.fromJSON(json.group) : undefined,
    });
  }
}
