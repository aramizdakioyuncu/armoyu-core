/**
 * Base class for all response mappers.
 * Provides shared logic and ensures consistency.
 */
export abstract class BaseMapper {
  /**
   * Helper to normalize nullable numbers.
   */
  protected static toNumber(value: any): number {
    return value !== undefined && value !== null ? Number(value) : 0;
  }

  /**
   * Helper to normalize boolean flags from API (1/0 or actual bool).
   */
  protected static toBool(value: any): boolean {
    return Number(value) === 1 || !!value;
  }

  /**
   * Helper to strictly normalize values to strings.
   */
  protected static toString(value: any): string {
    if (value === undefined || value === null) return '';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  /**
   * Helper to safely extract an image URL from strings or ARMOYU media objects.
   * Synched with armoyu-ui's robust logic.
   */
  protected static toImageUrl(value: any): string | undefined {
    if (!value) return undefined;
    
    // If it's already a string, return it
    if (typeof value === 'string') return value;
    
    // If it's an object, check all possible ARMOYU media keys
    if (typeof value === 'object') {
      // Direct media keys
      const url = value.media_URL || value.media_bigURL || value.media_minURL || value.url;
      if (url && typeof url === 'string') return url;
      
      // Nested chatImage or player_avatar fallbacks
      const nestedUrl = value.player_avatar || value.chatImage?.media_URL;
      if (nestedUrl && typeof nestedUrl === 'string') return nestedUrl;
    }
    
    return undefined;
  }

  /**
   * Checks if we should return the raw data based on version preference.
   */
  protected static shouldReturnRaw<T>(raw: any, usePreviousVersion: boolean): T | null {
    if (!raw) return null;
    if (usePreviousVersion) return raw as T;
    return null;
  }
}
