/**
 * Types of notifications.
 */
export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_ACCEPT = 'FRIEND_ACCEPT',
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  POST_MENTION = 'POST_MENTION',
  GROUP_INVITE = 'GROUP_INVITE',
  GROUP_ACCEPT = 'GROUP_ACCEPT',
  SYSTEM = 'SYSTEM',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  LEVEL_UP = 'LEVEL_UP',
  AWARD = 'AWARD'
}

/**
 * Priority of notifications.
 */
export enum NotificationPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

/**
 * Status of notifications.
 */
export enum NotificationStatus {
  UNREAD = 0,
  READ = 1,
  ARCHIVED = 2
}

/**
 * Categories for notifications.
 */
export enum NotificationCategory {
  ALL = 'all',
  SOCIAL = 'social',
  SYSTEM = 'system',
  COMMUNITY = 'community',
  GAMING = 'gaming'
}

/**
 * Sub-categories for notifications.
 */
export enum NotificationSubCategory {
  ALL = 'all',
  FRIENDSHIP = 'friendship',
  POSTS = 'posts',
  GROUPS = 'groups',
  AWARDS = 'awards'
}
