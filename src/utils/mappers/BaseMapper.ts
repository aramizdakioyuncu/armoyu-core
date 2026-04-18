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
   */
  protected static toImageUrl(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.media_URL || value.media_bigURL || value.url || value.media_minURL;
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
