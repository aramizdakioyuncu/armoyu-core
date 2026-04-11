/**
 * Categories for notifications in the ARMOYU platform.
 */
export enum NotificationCategory {
  FRIENDSHIP = 'arkadaslik',
  GROUPS = 'gruplar',
  SYSTEM = 'system',
  BLOG = 'blog',
  FORUM = 'forum',
  STORE = 'store'
}

/**
 * Detailed types for notifications (sub-categories).
 */
export enum NotificationSubCategory {
  REQUEST = 'istek',
  ACCEPT = 'onay',
  REJECT = 'red',
  INVITATION = 'davet',
  MENTION = 'etiket',
  COMMENT = 'yorum',
  LIKE = 'begeni'
}

/**
 * Types of notifications.
 */
export type NotificationType = 
  | 'POST_LIKE' | 'POST_COMMENT' | 'POST_MENTION' 
  | 'GROUP_INVITE' | 'GROUP_JOIN_REQUEST' | 'GROUP_ANNOUNCEMENT'
  | 'EVENT_INVITE' | 'EVENT_REMINDER'
  | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT'
  | 'SYSTEM_ALERT' | 'SYSTEM_UPDATE';
