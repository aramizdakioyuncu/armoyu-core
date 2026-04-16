/**
 * Authentication related enums.
 */
export enum AuthStatus {
  GUEST = 0,
  USER = 1,
  MODERATOR = 2,
  ADMIN = 3
}

/**
 * Preferences for password reset.
 */
export enum PasswordResetPreference {
  EMAIL = 'email',
  PHONE = 'phone',
  USER_INPUT = 'user_input'
}
